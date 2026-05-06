"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Part = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price?: number;
};

type CreatedBuild = {
  id: number;
};

const PART_CATEGORIES = [
  "cpu",
  "gpu",
  "motherboard",
  "ram",
  "storage",
  "psu",
  "case",
  "cooler",
] as const;

const USE_CASES = [
  { value: "gaming", label: "Gaming" },
  { value: "workstation", label: "Workstation" },
  { value: "video_editing", label: "Video Editing" },
  { value: "programming", label: "Programming" },
  { value: "general", label: "General Use" },
] as const;

function formatCategory(category: string) {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function NewBuildPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("My Manual Build");
  const [budget, setBudget] = useState("1500");
  const [useCase, setUseCase] = useState("gaming");
  const [selectedParts, setSelectedParts] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadParts() {
      try {
        const data = await api.get<Part[]>("/parts/");
        setParts(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not load parts.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadParts();
  }, []);

  function handlePartChange(category: string, partId: string) {
    setSelectedParts((current) => ({
      ...current,
      [category]: partId,
    }));
  }

  async function handleCreateBuild() {
    const numericBudget = Number(budget);

    if (!Number.isFinite(numericBudget) || numericBudget < 300) {
      setError("Please enter a valid budget of at least $300.");
      return;
    }

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const partIds = PART_CATEGORIES.map((category) => selectedParts[category])
      .filter(Boolean)
      .map((value) => Number(value));

    if (partIds.length === 0) {
      setError("Choose at least one part before saving your build.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const data = await api.post<CreatedBuild>("/builds/", {
        name: name.trim() || "My Manual Build",
        use_case: useCase,
        budget: numericBudget,
        part_ids: partIds,
      });

      router.push(`/builds/${data.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create build.";
      setError(message);
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 py-20 text-green-400">
      <section className="mx-auto max-w-5xl rounded-lg border border-green-900 bg-zinc-950 p-8">
        <p className="mb-4 text-sm tracking-widest text-green-700">
          &gt; new build route loaded...
        </p>

        <h1 className="mb-4 text-4xl font-bold text-green-300">
          Build from Scratch
        </h1>

        <p className="mb-8 max-w-2xl text-green-700">
          Choose your parts manually, save the build, and jump straight into the
          details page.
        </p>

        {error && (
          <div className="mb-6 rounded border border-red-900 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="rounded border border-green-900 bg-black p-4 text-green-700">
            Loading parts...
          </p>
        ) : (
          <>
            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-green-300">
                  Build Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border border-green-900 bg-black px-3 py-2 text-green-300 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-green-300">
                  Budget
                </label>
                <input
                  type="number"
                  min={300}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded border border-green-900 bg-black px-3 py-2 text-green-300 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-green-300">
                  Use Case
                </label>
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full rounded border border-green-900 bg-black px-3 py-2 text-green-300 focus:border-green-500 focus:outline-none"
                >
                  {USE_CASES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {PART_CATEGORIES.map((category) => {
                const categoryParts = parts.filter(
                  (part) => part.category === category
                );

                return (
                  <div
                    key={category}
                    className="rounded-lg border border-green-900 bg-black p-5"
                  >
                    <label className="mb-2 block text-sm font-semibold uppercase tracking-widest text-green-700">
                      {formatCategory(category)}
                    </label>

                    <select
                      value={selectedParts[category] || ""}
                      onChange={(e) =>
                        handlePartChange(category, e.target.value)
                      }
                      className="w-full rounded border border-green-900 bg-zinc-950 px-3 py-2 text-green-300 focus:border-green-500 focus:outline-none"
                    >
                      <option value="">Skip for now</option>
                      {categoryParts.map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.name} - {part.brand}
                          {part.price ? ` ($${part.price})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCreateBuild}
                disabled={isSaving || isAuthLoading}
                className="rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Manual Build"}
              </button>

              <Link
                href="/builds"
                className="inline-block rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950"
              >
                Back to Builds
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
