"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "student" | "staff" | "register";
type Profile = { id: string; full_name: string | null; role: string | null; college_name?: string | null; email?: string | null };
type Notice = { kind: "error" | "success"; text: string } | null;
const supabase = createSupabaseBrowserClient();
const OTP_URL = "https://ueavgukmwlydxktekxdh.supabase.co/functions/v1/student-otp-login";

export default function Page(): React.JSX.Element {
 const [mode,setMode]=useState<Mode>("student"),[registration,setRegistration]=useState(""),[roll,setRoll]=useState(""),[otp,setOtp]=useState("");
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[challenge,setChallenge]=useState<{registration_no:string;roll_no:string}|null>(null);
 const [maskedEmail,setMaskedEmail]=useState(""),[busy,setBusy]=useState(false),[notice,setNotice]=useState<Notice>(null);
 const [user,setUser]=useState<User|null>(null),[profile,setProfile]=useState<Profile|null>(null);

 useEffect(()=>{let alive=true;
  supabase.auth.getSession().then(async({data})=>{if(!alive||!data.session?.user)return;setUser(data.session.user);const {data:p}=await supabase.from("profiles").select("id,full_name,role,college_name,email").eq("id",data.session.user.id).maybeSingle();if(alive&&p)setProfile(p as Profile)});
  const {data:listener}=supabase.auth.onAuthStateChange((_event,session)=>{if(alive&&!session){setUser(null);setProfile(null)}});
  return()=>{alive=false;listener.subscription.unsubscribe()};
 },[]);

 async function sendOtp(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setNotice(null);try{
  if(!registration.trim()||!roll.trim())throw new Error("Registration number and college roll number are required.");
  const res=await fetch(OTP_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"start",registration_no:registration.trim(),roll_no:roll.trim()})});
  const d=(await res.json()) as {error?:string;masked_email?:string};if(!res.ok)throw new Error(d.error||"Could not send OTP.");
  setChallenge({registration_no:registration.trim(),roll_no:roll.trim()});setMaskedEmail(d.masked_email||"your registered email");setNotice({kind:"success",text:"OTP request sent. Check your registered email."});
 }catch(e){setNotice({kind:"error",text:e instanceof Error?e.message:"Could not send OTP."})}finally{setBusy(false)}}

 async function verifyOtp(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!challenge)return;setBusy(true);setNotice(null);try{
  const res=await fetch(OTP_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"verify",...challenge,otp:otp.trim()})});
  const d=(await res.json()) as {error?:string;session?:{access_token:string;refresh_token:string}};
  if(!res.ok||!d.session)throw new Error(d.error||"OTP verification failed.");
  const {error}=await supabase.auth.setSession(d.session);if(error)throw error;const {data}=await supabase.auth.getUser();
  if(data.user){setUser(data.user);const {data:p}=await supabase.from("profiles").select("id,full_name,role,college_name,email").eq("id",data.user.id).maybeSingle();if(p)setProfile(p as Profile)}
  setNotice({kind:"success",text:"OTP verified successfully."});
 }catch(e){setNotice({kind:"error",text:e instanceof Error?e.message:"OTP verification failed."})}finally{setBusy(false)}}

 async function staffSignIn(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setNotice(null);try{
  const {data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;if(!data.user)throw new Error("Staff sign-in failed.");
  const {data:p,error:pe}=await supabase.from("profiles").select("id,full_name,role,college_name,email").eq("id",data.user.id).maybeSingle();if(pe)throw pe;
  if(!p||!["admin","node_officer"].includes(p.role)){await supabase.auth.signOut();throw new Error("This account is not configured as SHIVORIX staff.")}
  setUser(data.user);setProfile(p as Profile);setNotice({kind:"success",text:"Signed in successfully."});
 }catch(e){setNotice({kind:"error",text:e instanceof Error?e.message:"Staff sign-in failed."})}finally{setBusy(false)}}

 async function signOut(){await supabase.auth.signOut();setUser(null);setProfile(null);setChallenge(null);setOtp("");setNotice(null)}
 const role=profile?.role==="admin"?"SHIVORIX Admin":profile?.role==="node_officer"?"Nodal Officer":"Student";
 return <main className="min-h-screen bg-[#f7f5fc] text-slate-900"><div className="mx-auto grid min-h-screen max-w-7xl gap-6 p-4 md:grid-cols-[1fr_1fr] md:p-8">
  <section className="flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-[#5426a8] via-[#5426a8] to-[#f36c21] p-7 text-white shadow-xl md:p-10">
   <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-lg font-black text-[#5426a8]">S</div><div><p className="text-xl font-black tracking-[.16em]">SHIVORIX</p><p className="text-xs tracking-[.2em] text-white/75">INTERNSHIP PORTAL</p></div></div>
   <div className="my-10"><p className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold">DIGITAL INTERNSHIP MANAGEMENT</p><h1 className="text-4xl font-black leading-tight md:text-5xl">Build your <span className="text-orange-200">professional future.</span></h1><p className="mt-5 max-w-lg leading-7 text-white/80">A secure platform for student registration, internship coordination, practical learning and academic completion.</p></div>
   <div className="grid gap-3 border-t border-white/20 pt-5 text-sm sm:grid-cols-2">{["Student profiles","College-wise coordination","Sector-based learning","Attendance & completion"].map((x,i)=><div key={x} className="flex gap-3 rounded-xl bg-white/10 p-3"><b className="text-orange-200">0{i+1}</b>{x}</div>)}</div>
  </section>
  <section className="flex items-center justify-center py-4"><div className="w-full max-w-xl rounded-[28px] border border-violet-100 bg-white p-6 shadow-xl md:p-9">
  {user?<><div className="mb-7 flex items-center justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-[#5426a8]">SHIVORIX</p><h2 className="mt-2 text-2xl font-black">Welcome, {profile?.full_name||user.user_metadata?.full_name||"User"}</h2></div><button onClick={signOut} className="rounded-xl border px-4 py-2 text-sm font-bold">Sign out</button></div><div className="rounded-2xl bg-violet-50 p-5"><p className="text-sm text-slate-500">Signed in as</p><p className="mt-1 text-lg font-bold text-[#5426a8]">{role}</p><p className="mt-2 break-all text-sm text-slate-600">{profile?.email||user.email||user.id}</p>{profile?.college_name&&<p className="mt-1 text-sm">{profile.college_name}</p>}</div><p className="mt-5 rounded-xl bg-orange-50 p-4 text-sm leading-6">The sign-in interface is now React + TypeScript. Role dashboards and remaining portal modules still need migration before the old HTML app can be removed safely.</p></>:<>
  <p className="text-sm font-bold uppercase tracking-[.18em] text-[#5426a8]">Secure portal access</p><h2 className="mt-2 text-3xl font-black">Sign in to continue</h2><p className="mt-2 text-sm text-slate-500">Use student credentials or an authorised staff account.</p>
  <div className="mt-7 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">{([{id:"student",label:"Student"},{id:"staff",label:"Staff"},{id:"register",label:"Register"}] as const).map(t=><button key={t.id} onClick={()=>{setMode(t.id);setNotice(null)}} className={`rounded-xl px-2 py-3 text-sm font-bold ${mode===t.id?"bg-white text-[#5426a8] shadow-sm":"text-slate-500"}`}>{t.label}</button>)}</div>
  {mode==="student"&&!challenge&&<form onSubmit={sendOtp} className="mt-6 space-y-4"><Field label="University Registration Number" value={registration} onChange={setRegistration} placeholder="Enter registration number"/><Field label="College Roll Number" value={roll} onChange={setRoll} placeholder="Enter college roll number"/><Submit busy={busy} label="Send OTP"/></form>}
  {mode==="student"&&challenge&&<form onSubmit={verifyOtp} className="mt-6 space-y-4"><p className="rounded-xl bg-violet-50 p-3 text-sm">OTP sent to <b>{maskedEmail}</b></p><Field label="One-time password" value={otp} onChange={setOtp} placeholder="Enter OTP"/><Submit busy={busy} label="Verify OTP & Sign In"/><button type="button" onClick={()=>{setChallenge(null);setOtp("");setNotice(null)}} className="w-full rounded-xl border px-5 py-3 font-semibold">Back</button></form>}
  {mode==="staff"&&<form onSubmit={staffSignIn} className="mt-6 space-y-4"><Field label="Staff email" value={email} onChange={setEmail} placeholder="Enter authorised email" type="email"/><Field label="Password" value={password} onChange={setPassword} placeholder="Enter password" type="password"/><Submit busy={busy} label="Staff Sign In"/></form>}
  {mode==="register"&&<p className="mt-6 rounded-xl bg-orange-50 p-4 text-sm leading-6">Registration form is not migrated yet. It must be rebuilt as a typed React form before enabling account creation.</p>}
  {notice&&<p role="status" className={`mt-5 rounded-xl p-3 text-sm ${notice.kind==="error"?"bg-red-50 text-red-700":"bg-emerald-50 text-emerald-700"}`}>{notice.text}</p>}<p className="mt-7 text-center text-xs text-slate-400">SHIVORIX · Digital Marketing, AI & IT Hub</p></>}</div></section></div></main>
}
function Field({label,value,onChange,placeholder,type="text"}:{label:string;value:string;onChange:(value:string)=>void;placeholder:string;type?:string}):React.JSX.Element{return <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">{label}</span><input required value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base outline-none placeholder:text-slate-400 focus:border-[#5426a8] focus:ring-4 focus:ring-violet-100"/></label>}
function Submit({busy,label}:{busy:boolean;label:string}):React.JSX.Element{return <button disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-[#5426a8] to-[#f36c21] px-5 py-3.5 font-bold text-white disabled:opacity-60">{busy?"Please wait…":label}</button>}
