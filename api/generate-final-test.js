export const config={maxDuration:120};
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 try{
  const {sourceText}=req.body||{};
  if(!sourceText||sourceText.length<80)return res.status(400).json({error:'Not enough course content was provided.'});
  const key=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
  if(!key)return res.status(500).json({error:'AI Gateway authentication is not configured.'});
  const prompt='Create a final internship assessment from the supplied lecture material. Return EXACTLY 20 MCQs as JSON only in the shape {"questions":[{"question_text":"...","options":["A","B","C","D"],"correct_answer":"one exact option"}]}. Questions must be based only on the supplied material, cover different lectures/topics, avoid duplicates, have exactly four options, and have exactly one correct answer. Do not add markdown or explanation.\n\nSOURCE MATERIAL:\n'+sourceText.slice(0,60000);
  const r=await fetch('https://ai-gateway.vercel.sh/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-5.6-sol',messages:[{role:'system',content:'You generate accurate assessment questions from provided source material.'},{role:'user',content:prompt}],temperature:0.2,response_format:{type:'json_object'}})});
  const b=await r.json();if(!r.ok)return res.status(502).json({error:b?.error?.message||'AI generation failed.'});
  const raw=b?.choices?.[0]?.message?.content||'';
  const parsed=JSON.parse(raw);
  const qs=Array.isArray(parsed.questions)?parsed.questions:[];
  if(qs.length!==20)return res.status(422).json({error:'AI did not return exactly 20 questions.'});
  for(const q of qs){if(!q.question_text||!Array.isArray(q.options)||q.options.length!==4||!q.correct_answer||!q.options.includes(q.correct_answer))return res.status(422).json({error:'AI returned an invalid question set. Please regenerate.'});}
  return res.status(200).json({questions:qs});
 }catch(e){console.error('Final test generation failed:',e);return res.status(500).json({error:e?.message||'Unable to generate Final Test.'})}
}