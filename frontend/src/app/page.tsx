"use client";

import { useState } from "react";

export default function HomePage() {
  // controls which screen to show
  const [step, setStep] = useState("landing");
  const [experienceLevel, setExperienceLevel] = useState("beginner");

  return (
    <div>
      <div className="bg-black border-b border-green-900 py-24 text-center px-4">
        <p className="text-green-700 text-sm tracking-widest mb-4">
          &gt; initializing pc_builder.exe...
        </p>
        <h1 className="text-5xl font-bold text-green-400 matrix-glow mb-4">
          Build Your Perfect PC
        </h1>
        <p className="text-green-700 text-lg mb-10 max-w-lg mx-auto">
          Tell us your budget and what you need — we'll pick the best parts for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { setExperienceLevel("beginner"); setStep("form"); }}
            className="bg-green-500 text-black font-bold px-6 py-3 rounded hover:bg-green-400 transition-all"
          >
            I'm new to PC building
          </button>
          <button
            onClick={() => { setExperienceLevel("experienced"); setStep("form"); }}
            className="border border-green-700 text-green-400 font-semibold px-6 py-3 rounded hover:bg-green-950 transition-all"
          >
            I know what I'm doing
          </button>
        </div>
      </div>
    </div>
  );
}