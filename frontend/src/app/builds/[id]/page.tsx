"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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
  created_at: string;
};

function formatLabel(value: string | null) {
  if (!value) return "Not set";
  return value.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function BuildDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [build, setBuild] = useState<Build | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadBuild() {
      try {
        const data = await api.get<Build>(`/builds/${id}`);
        setBuild(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load build details.");
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadBuild();
  }, [id]);

  async function handleDeleteBuild() {
    if (!id || isDeleting) return;
    if (!window.confirm("Delete this build? This action cannot be undone.")) return;
    try {
      setIsDeleting(true);
      setError("");
      await api.delete(`/builds/${id}`);
      router.push("/builds/list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete build.");
      setIsDeleting(false);
    }
  }

  function handleExportBuild() {
    if (!build) return;
    const fileName = build.name.trim().toLowerCase().replace(/\s+/g, "-") || `build-${build.id}`;
    const blob = new Blob([JSON.stringify(build, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background px-4 py-20 text-foreground">
      <section className="mx-auto max-w-5xl rounded-lg border border-border bg-card p-8">
        <p className="mb-4 text-sm tracking-widest text-muted-foreground">
          &gt; build details route loaded...
        </p>
        <h1 className="mb-2 text-4xl font-bold text-primary">Build Details</h1>
        <p className="mb-8 text-muted-foreground">Review the saved build breakdown and selected parts.</p>

        {isLoading && (
          <p className="rounded border border-border bg-background p-4 text-muted-foreground">
            Loading build details...
          </p>
        )}

        {!isLoading && error && (
          <div className="rounded-lg border border-red-900 bg-red-950/20 p-6">
            <h2 className="mb-2 text-xl font-semibold text-red-300">Could not load build details</h2>
            <p className="mb-4 text-sm text-red-200">Make sure the backend is running and that you are signed in, then try again.</p>
            <p className="mb-4 text-sm text-red-300/80">{error}</p>
            <Link href="/builds/list" className="inline-block rounded border border-red-700 px-4 py-2 text-sm font-semibold text-red-200 transition-all hover:bg-red-950/40">
              Back to Saved Builds
            </Link>
          </div>
        )}

        {!isLoading && !error && build && (
          <>
            <div className="mb-6 rounded-lg border border-border bg-background p-6">
              <h2 className="mb-3 text-2xl font-semibold text-foreground">Build Summary</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Build ID", value: `#${build.id}` },
                  { label: "Use Case", value: formatLabel(build.use_case) },
                  { label: "Budget", value: build.budget !== null ? `$${build.budget.toFixed(2)}` : "Not set" },
                  { label: "Total Cost", value: `$${build.total_cost.toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded border border-border bg-card p-4">
                    <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
                    <p className="text-lg font-semibold text-primary">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 rounded-lg border border-border bg-background p-6">
              <h2 className="mb-3 text-2xl font-semibold text-foreground">Selected Parts</h2>
              <div className="space-y-4">
                {build.parts.map((part) => (
                  <div key={part.part_id} className="rounded border border-border bg-card p-4">
                    <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">{formatLabel(part.category)}</p>
                    <p className="text-lg font-semibold text-foreground">{part.part_name}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Quantity: {part.quantity}</p>
                    <p className="text-sm text-muted-foreground">
                      Subtotal: {part.subtotal !== null ? `$${part.subtotal.toFixed(2)}` : "Not available"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 rounded-lg border border-border bg-background p-6">
              <h2 className="mb-3 text-2xl font-semibold text-foreground">Build Actions</h2>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleDeleteBuild}
                  disabled={isDeleting}
                  className="rounded border border-red-700 px-4 py-2 text-sm font-semibold text-red-400 transition-all hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete Build"}
                </button>
                <button
                  type="button"
                  onClick={handleExportBuild}
                  className="rounded border border-primary px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-accent"
                >
                  Export Build
                </button>
              </div>
            </div>

            <Link href="/builds/list" className="inline-block rounded border border-primary px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-accent">
              Back to Saved Builds
            </Link>
          </>
        )}
      </section>
    </div>
  );
}