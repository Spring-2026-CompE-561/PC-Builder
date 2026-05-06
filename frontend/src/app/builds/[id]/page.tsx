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
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
        const message =
          err instanceof Error ? err.message : "Could not load build details.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadBuild();
    }
  }, [id]);

  async function handleDeleteBuild() {
    if (!id || isDeleting) return;

    const confirmed = window.confirm(
      "Delete this build? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError("");
      await api.delete(`/builds/${id}`);
      router.push("/builds/list");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete build.";
      setError(message);
      setIsDeleting(false);
    }
  }


  return (
    <div className="min-h-screen bg-black px-4 py-20 text-green-400">
      <section className="mx-auto max-w-5xl rounded-lg border border-green-900 bg-zinc-950 p-8">
        <p className="mb-4 text-sm tracking-widest text-green-700">
          &gt; build details route loaded...
        </p>

        <h1 className="mb-2 text-4xl font-bold text-green-300">
          Build Details
        </h1>

        <p className="mb-8 text-green-700">
          Review the saved build breakdown and selected parts.
        </p>

        {isLoading && (
          <p className="rounded border border-green-900 bg-black p-4 text-green-700">
            Loading build details...
          </p>
        )}

        {!isLoading && error && (
          <div className="rounded-lg border border-red-900 bg-red-950/20 p-6">
            <h2 className="mb-2 text-xl font-semibold text-red-300">
              Could not load build details
            </h2>
            <p className="mb-4 text-sm text-red-200">
              Make sure the backend is running and that you are signed in, then try again.
            </p>
            <p className="mb-4 text-sm text-red-300/80">{error}</p>
            <Link
              href="/builds/list"
              className="inline-block rounded border border-red-700 px-4 py-2 text-sm font-semibold text-red-200 transition-all hover:bg-red-950/40"
            >
              Back to Saved Builds
            </Link>
          </div>
        )}

        {!isLoading && !error && build && (
          <>
            <div className="mb-6 rounded-lg border border-green-900 bg-black p-6">
              <h2 className="mb-3 text-2xl font-semibold text-green-300">
                Build Summary
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded border border-green-900 bg-zinc-950 p-4">
                  <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                    Build ID
                  </p>
                  <p className="text-lg font-semibold text-green-300">
                    #{build.id}
                  </p>
                </div>

                <div className="rounded border border-green-900 bg-zinc-950 p-4">
                  <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                    Use Case
                  </p>
                  <p className="text-lg font-semibold text-green-300">
                    {formatLabel(build.use_case)}
                  </p>
                </div>

                <div className="rounded border border-green-900 bg-zinc-950 p-4">
                  <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                    Budget
                  </p>
                  <p className="text-lg font-semibold text-green-300">
                    {build.budget !== null ? `$${build.budget.toFixed(2)}` : "Not set"}
                  </p>
                </div>

                <div className="rounded border border-green-900 bg-zinc-950 p-4">
                  <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                    Total Cost
                  </p>
                  <p className="text-lg font-semibold text-green-300">
                    ${build.total_cost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 rounded-lg border border-green-900 bg-black p-6">
              <h2 className="mb-3 text-2xl font-semibold text-green-300">
                Selected Parts
              </h2>

              <div className="space-y-4">
                {build.parts.map((part) => (
                  <div
                    key={part.part_id}
                    className="rounded border border-green-900 bg-zinc-950 p-4"
                  >
                    <p className="mb-1 text-xs uppercase tracking-widest text-green-700">
                      {formatLabel(part.category)}
                    </p>
                    <p className="text-lg font-semibold text-green-300">
                      {part.part_name}
                    </p>
                    <p className="mt-2 text-sm text-green-700">
                      Quantity: {part.quantity}
                    </p>
                    <p className="text-sm text-green-700">
                      Subtotal:{" "}
                      {part.subtotal !== null ? `$${part.subtotal.toFixed(2)}` : "Not available"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 rounded-lg border border-green-900 bg-black p-6">
              <h2 className="mb-3 text-2xl font-semibold text-green-300">
                Build Actions
              </h2>
              <p className="mb-4 text-sm text-green-700">
                Save and export options will connect to the backend later.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleDeleteBuild}
                  disabled={isDeleting}
                  className="rounded border border-red-700 px-4 py-2 text-sm font-semibold text-red-300 transition-all hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete Build"}
                </button>

                <button
                  type="button"
                  className="rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950"
                >
                  Export Build
                </button>
              </div>

            </div>

            <Link
              href="/builds/list"
              className="inline-block rounded border border-green-700 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:bg-green-950"
            >
              Back to Saved Builds
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
