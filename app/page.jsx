"use client";

import { useState } from "react";

const nav = [
  ["Dashboard","Overview","⌂"],
  ["My Profile","Personal & academic details","◎"],
  ["Internship","Application & status","◆"],
  ["Learning","Lectures, assignments & tests","▣"],
  ["Attendance","Progress tracking","◷"],
  ["Documents","Uploaded documents","▤"],
  ["Certificate","Completion certificate","✦"],
  ["Reports","Internship reports","▥"],
];

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState("Dashboard");

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <main className="v2">
      <aside className="sidebar">
        <div className="brandBlock">
          <div className="logoLockup">
            <img className="brandLogo" src="/shivorix-logo.svg" alt="SHIVORIX official logo" style={{width:46,height:46,borderRadius:"50%",objectFit:"cover",background:"#fff",boxShadow:"0 5px 18px #00000030"}} />
            <div><div className="brand">SHIVORIX</div><span>Digital • AI • IT Hub</span></div>
          </div>
          <div className="portalLabel">INTERNSHIP MANAGEMENT PORTAL</div>
        </div>
        <div className="profileMini">
          <div className="avatar">ST</div>
          <div><strong>Student Account</strong><small>Internship Programme</small></div>
        </div>
        <nav aria-label="Student navigation">
          {nav.map(([label, sub, icon]) => (
            <button key={label} className={active === label ? "navItem active" : "navItem"} onClick={() => setActive(label)}>
              <span className="navIcon">{icon}</span>
              <span className="navText"><b>{label}</b><small>{sub}</small></span>
            </button>
          ))}
        </nav>
        <div className="sideBottom">
          <div className="securityBadge"><span>✓</span><div><b>Secure Portal</b><small>Protected access</small></div></div>
          <button className="logout" onClick={() => setLoggedIn(false)}>Sign out</button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><div className="eyebrow">SHIVORIX / STUDENT PORTAL</div><h1>{active}</h1></div>
          <div className="topActions">
            <button className="iconBtn" aria-label="Notifications">♢</button>
            <div className="userChip"><span className="avatar small">ST</span><span>Student</span><b>⌄</b></div>
          </div>
        </header>
        <div className="content">
          {active === "Dashboard" ? <Dashboard /> : <Placeholder title={active} />}
        </div>
      </section>
    </main>
  );
}

function LoginScreen({ onLogin }) {
  const [roll, setRoll] = useState("");
  const [registration, setRegistration] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");

  return (
    <main className="loginPage">
      <div className="loginGlow one" />
      <div className="loginGlow two" />
      <section className="loginShell">
        <div className="loginBrand">
          <img src="/shivorix-logo.svg" alt="SHIVORIX official logo" className="loginLogo" />
          <div className="portalLabel">INTERNSHIP MANAGEMENT PORTAL</div>
          <h1>Welcome to SHIVORIX.</h1>
          <p>Manage your internship application, learning, attendance, documents and completion journey from one secure portal.</p>
          <div className="loginTrust">
            <span>✓ Secure student access</span>
            <span>✓ Application tracking</span>
            <span>✓ Digital records</span>
          </div>
        </div>

        <div className="loginCard">
          <div className="loginKicker">STUDENT LOGIN</div>
          <h2>Access your internship portal</h2>
          <p className="loginHint">Use your College Roll No. and Registration No. to continue.</p>

          {!otpStep ? (
            <>
              <label>College Roll No.<input value={roll} onChange={e => setRoll(e.target.value)} placeholder="Enter roll number" /></label>
              <label>Registration No.<input value={registration} onChange={e => setRegistration(e.target.value)} placeholder="Enter registration number" /></label>
              <button className="loginButton" onClick={() => { if (roll && registration) setOtpStep(true); }}>Send OTP <span>→</span></button>
            </>
          ) : (
            <>
              <div className="otpNotice">OTP verification is required to securely access your account.</div>
              <label>Enter OTP<input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0,6))} placeholder="6-digit OTP" inputMode="numeric" /></label>
              <button className="loginButton" onClick={() => { if (otp.length === 6) onLogin(); }}>Verify & Continue <span>→</span></button>
              <button className="backButton" onClick={() => setOtpStep(false)}>← Change login details</button>
            </>
          )}

          <div className="loginFooter"><span>🔒 Protected student access</span><span>Need help? Contact your Nodal Officer</span></div>
        </div>
      </section>
    </main>
  );
}

function Dashboard() {
  return (
    <>
      <section className="heroCard">
        <div className="heroContent">
          <div className="pill">INTERNSHIP PROGRAMME • 2026</div>
          <h2>Welcome to your internship workspace.</h2>
          <p>Manage your application, learning, attendance, documents and completion journey from one secure dashboard.</p>
          <button className="primary">Continue Internship <span>→</span></button>
        </div>
        <div className="heroBrand">
          <img className="heroLogoImage" src="/shivorix-logo.svg" alt="SHIVORIX official logo" style={{display:"block",width:96,height:96,borderRadius:"50%",objectFit:"cover",background:"#fff",margin:"0 auto",boxShadow:"0 10px 28px #00000035"}} />
          <strong>SHIVORIX</strong><small>Internship Portal</small>
        </div>
      </section>
      <div className="trustStrip"><span><b>✓</b> Secure student access</span><span><b>✓</b> Application tracking</span><span><b>✓</b> Verified documents</span><span><b>✓</b> Digital learning records</span></div>
      <div className="stats"><Stat label="APPLICATION" value="Under Review" note="Awaiting verification" /><Stat label="INTERNSHIP HOURS" value="0 / 120" note="Hours completed" /><Stat label="ATTENDANCE" value="0%" note="Current attendance" /><Stat label="DOCUMENTS" value="0 / 5" note="Verified documents" /></div>
      <div className="grid2">
        <section className="card"><div className="cardHead"><div><span className="sectionKicker">NEXT STEP</span><h3>Complete your internship application</h3></div><span className="status amber">Pending</span></div><p className="muted">Submit your personal, academic and internship details with the required documents for verification.</p><div className="progress"><span style={{width:"35%"}} /></div><div className="progressMeta"><span>Profile & application</span><b>35%</b></div></section>
        <section className="card"><div className="cardHead"><div><span className="sectionKicker">PROGRAMME</span><h3>Internship overview</h3></div></div><div className="detailRow"><span>Duration</span><b>4–6 weeks</b></div><div className="detailRow"><span>Required hours</span><b>120 hours</b></div><div className="detailRow"><span>Academic credits</span><b>4 credits</b></div></section>
      </div>
      <section className="card"><div className="cardHead"><div><span className="sectionKicker">QUICK ACCESS</span><h3>Your internship workspace</h3></div></div><div className="quickGrid">{["Apply / Track Internship","Learning Centre","Upload Documents","Attendance","Assignments","Certificate"].map(x => <button className="quick" key={x}><span>↗</span>{x}<small>Open module</small></button>)}</div></section>
    </>
  );
}

function Stat({label,value,note}) { return <div className="stat"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>; }
function Placeholder({title}) { return <section className="card empty"><span className="sectionKicker">V2 MODULE</span><h2>{title}</h2><p>This module is part of the new SHIVORIX V2 portal. Its secure backend/API integration will be connected during the next build stage.</p></section>; }
