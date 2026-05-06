"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api";

const USE_CASES = [
  { value: "gaming", label: "Gaming", description: "High FPS, streaming" },
  { value: "workstation", label: "Workstation", description: "3D, rendering, multitasking" },
  { value: "office", label: "Office", description: "Browsing, everyday tasks" },
  { value: "budget", label: "Budget", description: "Best value for your money" },
];

const BRAND_OPTIONS = ["No preference", "AMD", "Intel", "NVIDIA", "Budget-friendly"];
const AESTHETIC_OPTIONS = ["No preference", "Minimal / Sleek", "RGB / Flashy", "Black & White"];

type BuildPart = {
  part_id: number;
  part_name: string;
  category: string | null;
  quantity: number;
  unit_price: number | null;
  subtotal: number | null;
};

type Build = {
  id: number;
  name: string;
  use_case: string | null;
  budget: number | null;
  total_cost: number;
  parts: BuildPart[];
};

export default function HomePage() {
  // controls which screen to show
  const [step, setStep] = useState("landing");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [useCase, setUseCase] = useState("gaming");

  // form values
  const [budget, setBudget] = useState("1000");
  const [brandPref, setBrandPref] = useState("No preference");
  const [aesthetic, setAesthetic] = useState("No preference");

  // generate state
  const [build, setBuild] = useState<Build | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setIsLoading(true);
    setError("");
    const brands = brandPref === "No preference" || brandPref === "Budget-friendly"
      ? []
      : [brandPref];
    try {
      const result = await api.post<Build>("/builds/generate", {
        budget: parseFloat(budget),
        use_case: useCase,
        preferred_brands: brands,
      });
      setBuild(result);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  function exportBuild() {
    if (!build) return;
    const lines = [
      `Build: ${build.name}`,
      `Total: $${build.total_cost.toFixed(2)}`,
      "",
      ...build.parts.map(
        (p) => `${p.category?.toUpperCase() ?? "PART"} — ${p.part_name} — $${p.unit_price?.toFixed(2) ?? "N/A"}`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-build.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Home Page
  if (step === "landing") {
    return (
      <div>
        {/* Front Banner */}
        <div className="bg-background border-b border-border py-24 text-center px-4">
          <p className="text-muted-foreground text-sm tracking-widest mb-4">
            &gt; initializing pc_builder.exe...
          </p>
          <h1 className="text-5xl font-bold text-primary matrix-glow mb-4">
            Build Your Perfect PC
          </h1>
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            Tell us your budget and what you need — we'll pick the best parts for you.
          </p>
          {/* Two Buttons for beginner vs experienced */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => { setExperienceLevel("beginner"); setStep("form"); }}
              className="bg-primary text-primary-foreground font-bold px-6 py-3 hover:bg-primary/90 matrix-btn"
            >
              I'm new to PC building
            </Button>
            <Button
              variant="outline"
              onClick={() => { setExperienceLevel("experienced"); setStep("form"); }}
              className="border-border text-primary px-6 py-3 hover:bg-accent"
            >
              I know what I'm doing
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div className="py-16 px-4 bg-background">
          <h2 className="text-xl font-bold text-center text-primary mb-10 tracking-widest uppercase">
            How it works
          </h2>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-10 h-10 border border-border text-primary rounded-full flex items-center justify-center font-bold mx-auto mb-3 matrix-glow">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-1">Set your budget</h3>
              <p className="text-sm text-muted-foreground">Tell us how much you want to spend.</p>
            </div>
            <div>
              <div className="w-10 h-10 border border-border text-primary rounded-full flex items-center justify-center font-bold mx-auto mb-3 matrix-glow">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-1">Pick your use case</h3>
              <p className="text-sm text-muted-foreground">Gaming, work, video editing — we tailor the build.</p>
            </div>
            <div>
              <div className="w-10 h-10 border border-border text-primary rounded-full flex items-center justify-center font-bold mx-auto mb-3 matrix-glow">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-1">Get your build</h3>
              <p className="text-sm text-muted-foreground">Full parts list with pros, cons, and alternatives.</p>
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="py-12 px-4 bg-card text-center border-t border-border">
          <h2 className="text-sm font-bold mb-6 text-muted-foreground tracking-widest uppercase">
            &gt; Or jump straight in
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {USE_CASES.map((uc) => (
              <Button
                key={uc.value}
                variant="outline"
                onClick={() => { setUseCase(uc.value); setExperienceLevel("beginner"); setStep("form"); }}
                className="border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
              >
                {uc.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Completed Builds */}
        <div className="pt-6 pb-14 px-6 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-primary font-bold text-3xl tracking-widest uppercase matrix-glow mb-8 text-center">
              Completed Builds
            </h2>
            <div className="grid grid-cols-5 gap-8 px-4">
              {[
                { img: "/build1.jpg", user: "KevdDoe" },
                { img: "/build2.jpg", user: "Krill" },
                { img: "/build3.jpg", user: "DonnyDigital" },
                { img: "/build4.jpg", user: "KyleTOS" },
                { img: "/build5.jpg", user: "Rockman" },
              ].map((build) => (
                <div key={build.user} className="border border-border bg-card">
                  <img src={build.img} alt={`build by ${build.user}`} className="w-full h-48 object-cover" />
                  <p className="text-muted-foreground text-sm px-3 py-2">by {build.user}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Build generator
  if (step === "form") {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-10">

          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => setStep("landing")}
            className="text-muted-foreground hover:text-primary mb-6 px-0"
          >
            ← back
          </Button>

          {/* Build card */}
          <Card className="bg-background border-border">
            <CardHeader>
              <span className="text-xs bg-accent text-primary border border-border px-2 py-1 w-fit">
                {experienceLevel === "beginner" ? "// guided build" : "// quick build"}
              </span>
              <CardTitle className="text-foreground text-2xl">Configure your build</CardTitle>
              <CardDescription className="text-muted-foreground">
                {experienceLevel === "beginner"
                  ? "We'll walk you through everything."
                  : "Just set your budget and use case — we'll handle the rest."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* Budget input */}
              <div>
                <Label className="text-primary mb-1">Total Budget (USD)</Label>
                <div className="flex items-center border border-border bg-background focus-within:border-primary transition-colors">
                  <span className="px-3 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    min={300}
                    max={10000}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 1000"
                    className="border-0 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimum $300</p>
              </div>

              {/* Use case picker */}
              <div>
                <Label className="text-primary mb-2">What will you use this PC for?</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {USE_CASES.map((uc) => (
                    <button
                      key={uc.value}
                      onClick={() => setUseCase(uc.value)}
                      className={`p-3 border text-left text-sm transition-all ${
                        useCase === uc.value
                          ? "border-primary bg-accent text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary"
                      }`}
                    >
                      <div className="font-medium">{uc.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{uc.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra options only shown for beginner path */}
              {experienceLevel === "beginner" && (
                <>
                  <div>
                    <Label className="text-primary mb-1">Brand Preference</Label>
                    <select
                      value={brandPref}
                      onChange={(e) => setBrandPref(e.target.value)}
                      className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:border-primary mt-1"
                    >
                      {BRAND_OPTIONS.map((b) => <option key={b} className="bg-background">{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <Label className="text-primary mb-1">Case Aesthetic</Label>
                    <select
                      value={aesthetic}
                      onChange={(e) => setAesthetic(e.target.value)}
                      className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:border-primary mt-1"
                    >
                      {AESTHETIC_OPTIONS.map((a) => <option key={a} className="bg-background">{a}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* error message */}
              {error && (
                <p className="text-sm text-red-400 border border-red-900 bg-red-950/20 px-3 py-2">{error}</p>
              )}

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 matrix-btn disabled:opacity-50"
              >
                {isLoading ? "> generating..." : "> Generate My Build"}
              </Button>

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results
  if (step === "results" && build) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-10">

          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => setStep("form")}
            className="text-muted-foreground hover:text-primary mb-6 px-0"
          >
            ← back
          </Button>

          {/* Results card */}
          <Card className="bg-background border-border">
            <CardHeader>
              <span className="text-xs bg-accent text-primary border border-border px-2 py-1 w-fit">
                // your build
              </span>
              <CardTitle className="text-foreground text-2xl">{build.name}</CardTitle>
              <CardDescription className="text-primary text-lg font-bold">
                Total: ${build.total_cost.toFixed(2)}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">

              {/* Parts list */}
              {build.parts.map((part) => (
                <div key={part.part_id} className="flex justify-between items-center border border-border px-4 py-3 bg-card">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
                      {part.category ?? "part"}
                    </p>
                    <p className="text-foreground text-sm font-medium">{part.part_name}</p>
                  </div>
                  <p className="text-primary text-sm font-bold">
                    ${part.unit_price?.toFixed(2) ?? "N/A"}
                  </p>
                </div>
              ))}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={exportBuild}
                  variant="outline"
                  className="flex-1 border-border text-primary hover:bg-accent"
                >
                  Export .txt
                </Button>
                <Button
                  onClick={() => { setBuild(null); setStep("landing"); }}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Start Over
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}