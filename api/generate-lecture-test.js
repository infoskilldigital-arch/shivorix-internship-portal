export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  try{
    const {title,description,sector,videoUrl,sourceText}=req.body||{};
    let transcript="";
    let transcriptLanguage="";
    if(videoUrl){
      const id=extractYouTubeId(videoUrl);
      if(!id) return res.status(400).json({error:"Please provide a valid YouTube lecture link."});
      const tr=await fetchYouTubeTranscript(id);
      transcript=tr.text;
      transcriptLanguage=tr.language||"";
      if(!transcript||transcript.length<50) return res.status(422).json({error:"No usable YouTube transcript/captions were found for this lecture. Please enable captions on YouTube or add lecture notes."});
    }
    const context=[
      title&&`Lecture: ${title}`,
      sector&&`Sector: ${sector}`,
      description&&`Description: ${description}`,
      transcript&&`YouTube transcript${transcriptLanguage?` (${transcriptLanguage})`:""}: ${transcript}`,
      !videoUrl&&sourceText&&`Lecture notes/transcript: ${sourceText}`
    ].filter(Boolean).join("\n");
    if(!context||context.length<20) return res.status(400).json({error:"Lecture content is missing. Add a YouTube lecture link or lecture notes."});
    const credential=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
    if(!credential) return res.status(503).json({error:"AI Gateway authentication is not configured on this Vercel project."});
    const prompt=`Create exactly 10 high-quality multiple-choice questions from the supplied lecture material. Do not use outside knowledge. Each question must have exactly 4 options, exactly one correct answer, and 1 mark. Avoid ambiguous wording, duplicate questions, and questions whose answer is not supported by the material. Return ONLY valid JSON in this exact shape: {"questions":[{"question_text":"...","options":["...","...","...","..."],"correct_answer":"..."}]}. The correct_answer must exactly match one option. Material:\n${context.slice(0,50000)}`;
    const ai=await fetch("https://ai-gateway.vercel.sh/v1/chat/completions",{method:"POST",headers:{"Authorization":`Bearer ${credential}`,"Content-Type":"application/json"},body:JSON.stringify({model:"openai/gpt-5.6-sol",temperature:0.2,messages:[{role:"system",content:"You are an exam-question generator. Follow the requested JSON format exactly."},{role:"user",content:prompt}]})});
    if(!ai.ok){const t=await ai.text();return res.status(502).json({error:"AI generation failed.",detail:t.slice(0,500)})}
    const payload=await ai.json();
    const raw=payload?.choices?.[0]?.message?.content||"";
    const cleaned=raw.replace(/^\s*\`\`\`json\s*/,"").replace(/\s*\`\`\`\s*$/,"").trim();
    let parsed; try{parsed=JSON.parse(cleaned)}catch(e){return res.status(502).json({error:"AI returned invalid question JSON."})}
    const questions=Array.isArray(parsed.questions)?parsed.questions:[];
    if(questions.length!==10) return res.status(502).json({error:"AI did not return exactly 10 questions."});
    for(const q of questions){
      if(!q?.question_text||!Array.isArray(q.options)||q.options.length!==4||!q.correct_answer||!q.options.includes(q.correct_answer)) return res.status(502).json({error:"AI returned an invalid MCQ."});
    }
    return res.status(200).json({questions,source:{type:videoUrl?"youtube_transcript":"notes",language:transcriptLanguage||null}});
  }catch(e){return res.status(500).json({error:e?.message||"Unable to generate questions."})}
}

function extractYouTubeId(url){
  try{
    const u=new URL(String(url||""));
    if(u.hostname==="youtu.be")return u.pathname.slice(1).split("/")[0]||null;
    if(u.hostname.includes("youtube.com")){
      if(u.pathname==="/watch")return u.searchParams.get("v");
      const p=u.pathname.split("/").filter(Boolean);
      if(["embed","shorts","live"].includes(p[0]))return p[1]||null;
    }
  }catch(_e){}
  return null;
}

async function fetchYouTubeTranscript(videoId){
  const page=await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&hl=en`,{headers:{"User-Agent":"Mozilla/5.0","Accept-Language":"en-US,en;q=0.9"}});
  if(!page.ok)throw new Error("Unable to read the YouTube lecture page.");
  const html=await page.text();
  const match=html.match(new RegExp('"captionTracks":(\\\\[.*?\\\\]),"audioTracks"', "s"));
  if(!match)throw new Error("No YouTube captions are available for this lecture.");
  let tracks;
  try{tracks=JSON.parse(match[1])}catch(_e){throw new Error("YouTube caption data could not be read.");}
  const preferred=[...tracks].sort((a,b)=>scoreCaptionTrack(b)-scoreCaptionTrack(a))[0];
  if(!preferred?.baseUrl)throw new Error("No usable YouTube caption track was found.");
  const captionUrl=preferred.baseUrl.replace(/\\u0026/g,"&");
  const cap=await fetch(captionUrl,{headers:{"User-Agent":"Mozilla/5.0"}});
  if(!cap.ok)throw new Error("YouTube captions could not be downloaded.");
  const xml=await cap.text();
  const parts=[];
  const re=new RegExp("<text[^>]*>([\\s\\S]*?)</text>","g");
  let m;
  while((m=re.exec(xml))){
    const t=decodeEntities(m[1]).replace(/\\s+/g," ").trim();
    if(t)parts.push(t);
  }
  return {text:parts.join(" "),language:preferred.languageCode||preferred.name?.simpleText||""};
}

function scoreCaptionTrack(track){
  const code=String(track?.languageCode||"").toLowerCase();
  let score=0;
  if(code.startsWith("en"))score+=100;
  if(code.startsWith("hi"))score+=90;
  if(track?.kind!=="asr")score+=20;
  return score;
}

function decodeEntities(s){
  return String(s||"")
    .replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#x27;/gi,"'")
    .replace(/&#x2F;/gi,"/");
}