"use client";

import { useEffect } from "react";

export default function Page(): React.JSX.Element {
  useEffect(() => {
    window.location.replace("/intro.html");
  }, []);
  return <main className="min-h-screen grid place-items-center bg-[#f7f5fc] text-[#5426a8] font-semibold">Opening SHIVORIX Internship Portal…</main>;
}
