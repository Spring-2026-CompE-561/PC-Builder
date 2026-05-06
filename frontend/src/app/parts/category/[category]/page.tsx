"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPartsByCategory, type Part, type PartQuery } from "@/lib/parts";
import PartCard from "@/components/PartCard";
import { PartsFilter, type FilterOptions } from "@/components/PartsFilter";
import Link from "next/link";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [filter, setFilter] = useState<PartQuery>({});

  const loadParts = useCallback(async (query: PartQuery) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPartsByCategory(category, query);
      setParts(data);
      const uniqueBrands = Array.from(
        new Set(data.map((p) => p.brand).filter(Boolean))
      );
      setBrands(uniqueBrands as string[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load parts");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (!category) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadParts(filter);
  }, [category, filter, loadParts]);

  function applyFilters(newFilters: FilterOptions) {
    setFilter({
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      brand: newFilters.brand,
      inStockOnly: newFilters.inStockOnly,
      sort: newFilters.sort,
      specKeys: newFilters.specKeys,
    });
  }

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/parts" className="text-blue-600 hover:underline">
          Components
        </Link>
        <span className="text-gray-400">/</span>
        <span className="capitalize text-gray-700">{category}</span>
      </div>

      <div className="mb-8 grid gap-8 xl:grid-cols-[280px_1fr]">
        <div>
          <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filter {category}</h2>
            <PartsFilter onFilterChange={applyFilters} brands={brands} />
          </div>
        </div>
        <div>
          <h1 className="mb-2 text-3xl font-bold capitalize">{category} Components</h1>
          <p className="mb-8 text-gray-600">Browse all {category} options</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">Error</h2>
          <p className="mt-2 text-red-700">{error}</p>
          <button
            onClick={() => loadParts(filter)}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Loading {category} parts...</p>
        </div>
      ) : parts.length === 0 ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">No {category} parts found</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {parts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      )}

      {!loading && parts.length > 0 && (
        <p className="mt-6 text-sm text-gray-500">Found {parts.length} parts</p>
      )}
    </div>
  );
}
