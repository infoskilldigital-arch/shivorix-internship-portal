import Image from "next/image";
import Link from "next/link";

const features = [
  { number: "01", title: "Explore opportunities", description: "Discover internship pathways and take the next step toward practical, career-focused experience.", icon: "↗" },
  { number: "02", title: "Build your profile", description: "Keep your essential academic and personal details organized in one convenient place.", icon: "▤" },
  { number: "03", title: "Track your journey", description: "Return to the portal to manage your application journey and related updates.", icon: "✓" },
];

export default function HomePage(): React.JSX.Element {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf9ff] text-[#251044]">
      <header className="mx-auto flex h-[82px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label="SHIVORIX home" className="shrink-0">
          <Image src="/shivorix-logo.svg" alt="SHIVORIX — Growth, Vision, Success" width={204} height={58} priority className="h-auto w-[158px] sm:w-[204px]" />
        </Link>
        <nav className="flex items-center gap-3 sm:gap-7">
          <a href="#opportunities" className="hidden text-sm font-semibold text-[#625775] transition hover:text-[#7138d5] sm:inline">Opportunities</a>
          <a href="#how-it-works" className="hidden text-sm font-semibold text-[#625775] transition hover:text-[#7138d5] md:inline">How it works</a>
          <Link href="/portal.html" className="rounded-xl border border-[#ded3f0] bg-white px-3 py-2.5 text-xs font-bold text-[#35136f] shadow-sm transition hover:-translate-y-0.5 sm:px-5 sm:text-sm">Student Login ↗</Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-9 sm:px-8 sm:pt-16 lg:grid-cols-[1.08fr_.92fr] lg:gap-14 lg:pb-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eadffb] bg-[#f4edff] px-3.5 py-2 text-[11px] font-extrabold tracking-[.12em] text-[#6331b6] sm:text-xs"><span className="h-2 w-2 rounded-full bg-[#ff8a22]" /> YOUR CAREER JOURNEY STARTS HERE</div>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.7rem,6vw,4.6rem)] font-black leading-[1.04] tracking-[-.055em]">Turn your potential into <span className="bg-gradient-to-r from-[#7138d5] to-[#ff8a22] bg-clip-text text-transparent">real experience.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#6d6680] sm:text-lg">Discover internship opportunities, build practical skills, and take your next step with the SHIVORIX Internship Portal—your space to learn, grow, and get career-ready.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/portal.html" className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#7138d5] to-[#8a45e8] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#7138d5]/20 transition hover:-translate-y-0.5">Explore the Portal <span className="ml-3">→</span></Link>
            <a href="#how-it-works" className="inline-flex items-center rounded-xl border border-[#ded3f0] bg-white px-5 py-3.5 text-sm font-bold text-[#35136f] transition hover:-translate-y-0.5">See how it works</a>
          </div>
          <p className="mt-6 text-xs text-[#7d748d]">A simpler path from classroom learning to workplace experience.</p>
        </div>

        <div className="relative mx-auto flex min-h-[340px] w-full max-w-xl items-center justify-center sm:min-h-[390px]">
          <div className="absolute h-[250px] w-[250px] rounded-full bg-gradient-to-br from-[#eee2ff] via-[#f8e9ff] to-[#fff0dd] sm:h-[340px] sm:w-[340px]" />
          <div className="absolute right-0 top-5 rounded-2xl border border-[#ece5f7] bg-white px-4 py-3 text-xs font-extrabold shadow-xl shadow-[#32195b]/10 sm:-right-1 sm:top-8">✦ &nbsp; Learn by doing</div>
          <div className="absolute bottom-4 left-0 rounded-2xl border border-[#ece5f7] bg-white px-4 py-3 text-xs font-extrabold shadow-xl shadow-[#32195b]/10 sm:-left-3 sm:bottom-8">🚀 &nbsp; Your future, in motion</div>
          <div className="relative w-full rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-[0_30px_90px_rgba(58,27,103,.12)] backdrop-blur sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><Image src="/shivorix-logo.svg" alt="" width={32} height={32} className="h-8 w-8 object-contain" /><span className="text-xs font-black tracking-wide">STUDENT SPACE</span></div>
              <span className="rounded-full bg-[#e8f8ef] px-3 py-2 text-[10px] font-extrabold text-[#237b58]">● Ready to grow</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Your next chapter.</h2>
            <p className="mt-1 text-xs text-[#6d6680]">A little progress every day adds up.</p>
            <div className="my-6 rounded-2xl bg-[#f8f4ff] p-4">
              <div className="flex justify-between text-xs font-extrabold"><span>Career journey</span><span className="text-[#7a45ce]">In progress</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7dcf9]"><div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#7138d5] to-[#ff8a22]" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">{[["01", "Build your profile"], ["02", "Explore opportunities"], ["03", "Apply with confidence"], ["04", "Track your journey"]].map(([n, label]) => <div key={n} className="rounded-2xl border border-[#ece5f7] p-3.5 sm:p-4"><strong className="block text-lg">{n}</strong><span className="mt-1 block text-[11px] leading-5 text-[#6d6680]">{label}</span></div>)}</div>
          </div>
        </div>
      </section>

      <section id="opportunities" className="border-y border-[#f0eafa] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center"><p className="text-xs font-black uppercase tracking-[.18em] text-[#8a55d7]">Made for your next step</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">More than an application form.</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6d6680] sm:text-base">A focused starting point for students to manage their internship journey with clarity and confidence.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">{features.map((item, i) => <article key={item.number} className="rounded-2xl border border-[#ece5f7] bg-white p-6 shadow-sm shadow-[#301052]/5 transition hover:-translate-y-1 hover:shadow-lg"><div className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl text-xl font-black ${i === 1 ? "bg-[#fff0df] text-[#b85b08]" : i === 2 ? "bg-[#e7f7ef] text-[#237b58]" : "bg-[#f1e8ff] text-[#7138d5]"}`}>{item.icon}</div><h3 className="text-lg font-extrabold">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#6d6680]">{item.description}</p></article>)}</div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#fbf9ff] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl text-center"><p className="text-xs font-black uppercase tracking-[.18em] text-[#8a55d7]">Simple to get started</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Your journey, step by step.</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6d6680] sm:text-base">Start with your account, complete your profile, and use the portal to move forward.</p>
          <div className="mt-9 grid gap-4 text-left sm:grid-cols-3">{[["01", "Sign in or register", "Open the student portal to access your account or begin registration."], ["02", "Complete your details", "Keep your profile and academic information ready for the application process."], ["03", "Take the next step", "Explore available portal features and follow the instructions shown in your account."]].map(([n, title, desc]) => <article key={n} className="rounded-2xl border border-[#ece5f7] bg-white p-5"><span className="text-sm font-black text-[#8a55d7]">{n}</span><h3 className="mt-3 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#6d6680]">{desc}</p></article>)}</div>
          <div className="mt-14 rounded-[26px] bg-gradient-to-br from-[#2c1554] to-[#6030a5] px-5 py-12 text-white sm:px-10"><h2 className="text-3xl font-black tracking-tight sm:text-4xl">Ready to take the next step?</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#e0d5f4] sm:text-base">Your professional journey starts with one small action. Open the SHIVORIX student portal to get started.</p><Link href="/portal.html" className="mt-7 inline-flex rounded-xl bg-[#ff8a22] px-5 py-3.5 text-sm font-extrabold text-[#2b154a] transition hover:-translate-y-0.5">Open Student Portal&nbsp; →</Link></div>
        </div>
      </section>
      <footer className="border-t border-[#ece5f7] bg-white px-5 py-6 text-xs text-[#7d748d] sm:px-8"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3"><span>© {new Date().getFullYear()} SHIVORIX. All rights reserved.</span><span>Learn with purpose. Grow with experience.</span></div></footer>
    </main>
  );
}
