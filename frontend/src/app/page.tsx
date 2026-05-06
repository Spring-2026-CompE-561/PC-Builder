"use client";

import { useState } from "react";
// ShadeCN Button instead of html
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// the different archtype of computer to select
const USE_CASES = [
  { value: "gaming", label: "Gaming", description: "High FPS, streaming" },
  { value: "workstation", label: "Workstation", description: "3D, rendering, multitasking" },
  { value: "video_editing", label: "Video Editing", description: "4K editing, color grading" },
  { value: "programming", label: "Programming", description: "Dev work, VMs, compiling" },
  { value: "general", label: "General Use", description: "Browsing, everyday tasks" },
];

const BRAND_OPTIONS = ["No preference", "AMD", "Intel", "NVIDIA", "Budget-friendly"];
const AESTHETIC_OPTIONS = ["No preference", "Minimal / Sleek", "RGB / Flashy", "Black & White"];

export default function HomePage() {
  // controls which screen to show
  const [step, setStep] = useState("landing");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [useCase, setUseCase] = useState("gaming");

  // form values
  const [budget, setBudget] = useState("1000");
  const [brandPref, setBrandPref] = useState("No preference");
  const [aesthetic, setAesthetic] = useState("No preference");

  // Home Page
  if (step === "landing") {
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
          {/* Two Buttons for beginner vs experienced */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => { setExperienceLevel("beginner"); setStep("form"); }}
              className="bg-green-500 text-black font-bold px-6 py-3 hover:bg-green-400 matrix-btn"
            >
              I'm new to PC building
            </Button>
            <Button
              variant="outline"
              onClick={() => { setExperienceLevel("experienced"); setStep("form"); }}
              className="border-green-700 text-green-400 px-6 py-3 hover:bg-green-950"
            >
              I know what I'm doing
            </Button>
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
              <Button
                key={uc.value}
                variant="outline"
                onClick={() => { setUseCase(uc.value); setExperienceLevel("beginner"); setStep("form"); }}
                className="border-green-900 bg-black text-green-600 hover:border-green-500 hover:text-green-400"
              >
                {uc.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Build generator 
  if (step === "form") {
    return (
      <div className="bg-black min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-10">

          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => setStep("landing")}
            className="text-green-800 hover:text-green-500 mb-6 px-0"
          >
            ← back
          </Button>

          {/* Build card */}
          <Card className="bg-black border-green-900">
            <CardHeader>
              <span className="text-xs bg-green-950 text-green-500 border border-green-800 px-2 py-1 w-fit">
                {experienceLevel === "beginner" ? "// guided build" : "// quick build"}
              </span>
              <CardTitle className="text-green-300 text-2xl">Configure your build</CardTitle>
              <CardDescription className="text-green-800">
                {experienceLevel === "beginner"
                  ? "We'll walk you through everything."
                  : "Just set your budget and use case — we'll handle the rest."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* Budget input */}
              <div>
                <Label className="text-green-400 mb-1">Total Budget (USD)</Label>
                <div className="flex items-center border border-green-900 bg-black focus-within:border-green-500 transition-colors">
                  <span className="px-3 text-green-700">$</span>
                  <Input
                    type="number"
                    min={300}
                    max={10000}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 1000"
                    className="border-0 bg-black text-green-400 placeholder:text-green-900 focus-visible:ring-0"
                  />
                </div>
                <p className="text-xs text-green-900 mt-1">Minimum $300</p>
              </div>

              {/* Use case picker */}
              <div>
                <Label className="text-green-400 mb-2">What will you use this PC for?</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {USE_CASES.map((uc) => (
                    <button
                      key={uc.value}
                      onClick={() => setUseCase(uc.value)}
                      className={`p-3 border text-left text-sm transition-all ${
                        useCase === uc.value
                          ? "border-green-500 bg-green-950 text-green-300"
                          : "border-green-900 bg-black text-green-700 hover:border-green-700"
                      }`}
                    >
                      <div className="font-medium">{uc.label}</div>
                      <div className="text-xs text-green-800 mt-0.5">{uc.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra options only shown for beginner path */}
              {experienceLevel === "beginner" && (
                <>
                  <div>
                    <Label className="text-green-400 mb-1">Brand Preference</Label>
                    <select
                      value={brandPref}
                      onChange={(e) => setBrandPref(e.target.value)}
                      className="w-full border border-green-900 px-3 py-2 text-sm bg-black text-green-400 focus:outline-none focus:border-green-500 mt-1"
                    >
                      {BRAND_OPTIONS.map((b) => <option key={b} className="bg-black">{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <Label className="text-green-400 mb-1">Case Aesthetic</Label>
                    <select
                      value={aesthetic}
                      onChange={(e) => setAesthetic(e.target.value)}
                      className="w-full border border-green-900 px-3 py-2 text-sm bg-black text-green-400 focus:outline-none focus:border-green-500 mt-1"
                    >
                      {AESTHETIC_OPTIONS.map((a) => <option key={a} className="bg-black">{a}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Generate button */}
              <Button className="w-full bg-green-500 text-black font-bold hover:bg-green-400 matrix-btn">
                &gt; Generate My Build
              </Button>

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}