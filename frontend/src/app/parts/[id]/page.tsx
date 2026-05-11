"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getPartById } from "@/lib/parts";
import type { Part } from "@/lib/parts";

export default function PartDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadPart();
  }, [id]);

  async function loadPart() {
    try {
      setLoading(true);
      setError(null);
      const data = await getPartById(id);
      setPart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load part");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">Error</h2>
          <p className="mt-2 text-red-700">{error}</p>
          <button
            onClick={loadPart}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Loading part details...</p>
        </div>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h2 className="text-lg font-semibold text-yellow-800">Not Found</h2>
          <p className="mt-2 text-yellow-700">This part does not exist</p>
          <Link href="/parts">
            <Button className="mt-4">Back to Parts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/parts" className="text-blue-600 hover:underline">
          Components
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href={`/parts/category/${part.category}`}
          className="capitalize text-blue-600 hover:underline"
        >
          {part.category}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700">{part.name}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-lg border bg-gray-50 p-8">
          {part.image_url ? (
            <img
              src={part.image_url}
              alt={part.name}
              className="max-h-96 max-w-full object-contain"
            />
          ) : (
            <div className="text-center">
              <p className="text-gray-400">No image available</p>
            </div>
          )}
        </div>

        <div>
          <h1 className="mb-2 text-3xl font-bold">{part.name}</h1>
          <p className="mb-4 text-gray-600">{part.brand}</p>

          <Link href={`/parts/category/${part.category}`}>
            <span className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm capitalize text-blue-700 hover:bg-blue-200">
              {part.category}
            </span>
          </Link>

          <div className="mb-8 rounded-lg border-2 border-green-200 bg-green-50 p-6">
            {part.price ? (
              <>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-4xl font-bold text-green-700">
                  ${part.price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Price not available</p>
            )}
          </div>

          {part.compatibility && (
            <div className="mb-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-semibold text-gray-700">Status</p>
              <p className="mt-1 text-gray-600">{part.compatibility}</p>
            </div>
          )}

          {part.specs && Object.keys(part.specs).length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Specifications</h2>
              <div className="space-y-3">
                {Object.entries(part.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="capitalize text-gray-600">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button size="lg" className="flex-1">
              Add to Build
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Compare
            </Button>
          </div>

          <Link href="/parts">
            <button className="mt-4 w-full rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              ← Back to Components
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
