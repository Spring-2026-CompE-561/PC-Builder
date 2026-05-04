"use client";

import { useState } from "react";

// the different archtype of computer to select
const USE_CASES = [
  { value: "gaming", label: "Gaming", description: "High FPS, streaming" },
  { value: "workstation", label: "Workstation", description: "3D, rendering, multitasking" },
  { value: "video_editing", label: "Video Editing", description: "4K editing, color grading" },
  { value: "programming", label: "Programming", description: "Dev work, VMs, compiling" },
  { value: "general", label: "General Use", description: "Browsing, everyday tasks" },
];

export default function HomePage() {
  // controls which screen to show
  const [step, setStep] = useState("landing");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [useCase, setUseCase] = useState("gaming");

  return (
    <div>
      {/* Front Banner */}
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

      {/* Description of how our model works */}
      <div className="py-16 px-4 bg-black">
        <h2 className="text-xl font-bold text-center text-green-400 mb-10 tracking-widest uppercase">
             How it works
        </h2>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-10 h-10 border border-green-600 text-green-400 rounded-full flex items-center justify-center font-bold mx-auto mb-3 matrix-glow">
              1
            </div>
            <h3 className="font-semibold text-green-300 mb-1">Set your budget</h3>
            <p className="text-sm text-green-800">Tell us how much you want to spend.</p>
          </div>
          <div>
            <div className="w-10 h-10 border border-green-600 text-green-400 rounded-full flex items-center justify-center font-bold mx-auto mb-3 matrix-glow">
              2
            </div>
            <h3 className="font-semibold text-green-300 mb-1">Pick your use case</h3>
            <p className="text-sm text-green-800">Gaming, work, video editing — we tailor the build.</p>
          </div>
          <div>
            <div className="w-10 h-10 border border-green-600 text-green-400 rounded-full flex items-center justify-center font-bold mx-auto mb-3 matrix-glow">
              3
            </div>
            <h3 className="font-semibold text-green-300 mb-1">Get your build</h3>
            <p className="text-sm text-green-800">Full parts list with pros, cons, and alternatives.</p>
          </div>
        </div>
      </div>

      {/* Shortcut straight to computer archtype */}
      <div className="py-12 px-4 bg-[#030f03] text-center border-t border-green-950">
        <h2 className="text-sm font-bold mb-6 text-green-700 tracking-widest uppercase">
          &gt; Or jump straight in
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {USE_CASES.map((uc) => (
            <button
              key={uc.value}
              onClick={() => { setUseCase(uc.value); setExperienceLevel("beginner"); setStep("form"); }}
              className="px-4 py-2 rounded border border-green-900 bg-black text-sm text-green-600 font-medium hover:border-green-500 hover:text-green-400 transition-all"
            >
              {uc.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}