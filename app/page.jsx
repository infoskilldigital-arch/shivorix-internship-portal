"use client";

import { useState } from "react";

const nav = [
  ["Dashboard","Overview"],
  ["My Profile","Personal & academic details"],
  ["Internship","Application & status"],
  ["Learning","Lectures, assignments & tests"],
  ["Attendance","Progress tracking"],
  ["Documents","Uploaded documents"],
  ["Certificate","Completion certificate"],
  ["Reports","Internship reports"],
];

export default function Page() {
  const [active, setActive] = useState("Dashboard");
  return (
    <main className="v2">
      <aside className="sidebar">
        <div className="brandMark"><div className="brand">SHIVORIX</div><span>Internship Portal</span></div>
        <div className="profileMini"><div className="avatar">SG</div><div><strong>Student</strong><small>Internship Programme</small></div></div>
        <nav>{nav.map(([label,sub]) => <button key={label} className={active===label ? "navItem active" : "navItem"} onClick={()=>setActive(label)}><span className="navDot" /><span><b>{label}</b><small>{sub}</small></span></button>)}</nav>
        <div className="sideBottom"><div className="secure">🔒 Secure Portal</div><button className="logout">Log out</button></div>
      </aside>
      <section className="workspace">
        <header className="topbar"><div><div className="eyebrow">SHIVORIX • STUDENT PORTAL</div><h1>{active}</h1></div><div className="topActions"><button className="iconBtn">♢</button><div className="userChip"><span className="avatar small">SG</span><span>Student</span></div></div></header>
        <div className="content">{active === "Dashboard" ? <Dashboard /> : <Placeholder title={active} />}</div>
      </section>
    </main>
  );
}

function Dashboard() {
  return <>
    <section className="heroCard"><div><span className="pill">INTERNSHIP 2026</span><h2>Welcome back 👋</h2><p>Your internship journey, learning progress and documents — all in one place.</p><button className="primary">Continue Internship →</button></div><div className="heroOrb"><span>4</span><small>Credits</small></div></section>
    <div className="stats">
      <Stat label="Application" value="Under Review" note="Awaiting verification" />
      <Stat label="Internship Hours" value="0 / 120" note="Hours completed" />
      <Stat label="Attendance" value="0%" note="Current attendance" />
      <Stat label="Documents" value="0 / 5" note="Verified documents" />
    </div>
    <div className="grid2">
      <section className="card"><div className="cardHead"><div><span className="sectionKicker">NEXT STEP</span><h3>Complete your internship application</h3></div><span className="status amber">Pending</span></div><p className="muted">Submit your personal, academic and internship details with the required documents.</p><div className="progress"><span style={{width:"35%"}} /></div><div className="progressMeta"><span>Profile & application</span><b>35%</b></div></section>
      <section className="card"><div className="cardHead"><div><span className="sectionKicker">PROGRAMME</span><h3>Internship overview</h3></div></div><div className="detailRow"><span>Duration</span><b>4–6 weeks</b></div><div className="detailRow"><span>Required hours</span><b>120 hours</b></div><div className="detailRow"><span>Credits</span><b>4 credits</b></div></section>
    </div>
    <section className="card"><div className="cardHead"><div><span className="sectionKicker">QUICK ACCESS</span><h3>Your internship workspace</h3></div></div><div className="quickGrid">{["Apply / Track Internship","Learning Centre","Upload Documents","Attendance","Assignments","Certificate"].map(x=><button className="quick" key={x}><span>↗</span>{x}</button>)}</div></section>
  </>;
}
function Stat({label,value,note}) { return <div className="stat"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>; }
function Placeholder({title}) { return <section className="card empty"><span className="sectionKicker">V2 MODULE</span><h2>{title}</h2><p>This module is part of the new SHIVORIX V2 interface. Backend/API integration will be connected after the UI foundation is approved.</p></section>; }
