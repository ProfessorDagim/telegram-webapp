// app/page.tsx
"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <div className="text-white text-center mt-20 text-2xl">✨ Starting chat...</div>;
  }

  return (
    <div className="welcome-screen">
      <div className="glowing-border" />

      <div className="text-center z-10 relative">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 drop-shadow-xl animate-fade-in">
          Welcome to <span className="text-blue-400">DE OMNI</span>
        </h1>

        <div className="logo-wrapper mx-auto mb-12">
          <Image
            src="/logo.png"
            alt="DE OMNI Logo"
            width={180}
            height={180}
            className="rounded-full glowing-logo"
            priority
          />
        </div>

        <button
          onClick={() => setStarted(true)}
          className="start-button"
        >
          Start
        </button>
      </div>
    </div>
  );
}
