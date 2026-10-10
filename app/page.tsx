"use client";

import { useState } from "react";

export default function Page(): React.JSX.Element {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <main className="portal-shell">
      {!loaded && (
        <div className="portal-loading">
          <div className="loader-card">
            <div className="brand">SHIVORIX</div>
            <h1>Internship Portal</h1>
            <p>Loading your secure portal…</p>
          </div>
        </div>
      )}
      <iframe
        title="SHIVORIX Internship Portal"
        src="/legacy.html"
        onLoad={() => setLoaded(true)}
        className="portal-frame"
      />
    </main>
  );
}
