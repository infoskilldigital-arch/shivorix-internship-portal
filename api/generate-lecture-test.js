export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  try{
    const {title,description,sector,sourceText}=req.body||{};
    const context=[title&&`Lecture: ${title}`,sector&&`Sector: ${sector}`,description&&`Description: ${description}`,sourceText&&`Lecture notes/transcript: ${sourceText}`].filter(Boolean).join("\n");
    if(!context||context.length<20) return res.status(400).json({error:"Please add a lecture description or notes before generating questions."});
    const credential=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
    if(!credential) return res.status(503).json({error:"AI Gateway authentication is not configured on this Vercel project."});
    const prompt=`Create exactly 10 high-quality multiple-choice questions from the supplied lecture material. Do not use outside knowledge. Each question must have exactly 4 options, exactly one correct answer, and 1 mark. Avoid ambiguous wording, duplicate questions, and questions whose answer is not supported by the material. Return ONLY valid JSON in this exact shape: {"questions":[{"question_text":"...","options":["...","...","...","..."],"correct_answer":"..."}]}. The correct_answer must exactly match one option. Material:\n${context.slice(0,30000)}`;
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
    return res.status(200).json({questions});
  }catch(e){return res.status(500).json({error:e?.message||"Unable to generate questions."})}
}