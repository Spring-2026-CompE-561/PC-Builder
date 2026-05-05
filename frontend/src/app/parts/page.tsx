"use client";

import { useEffect, useState } from "react";
import { getParts } from "@/lib/parts";
import PartCard from "@/components/PartCard";
import { PartsFilter, type FilterOptions } from "@/components/PartsFilter";
import Link from "next/link";
import type { Part } from "@/lib/parts";

export default function PartsPage() {
  // State management
  const [parts, setParts] = useState<Part[]>([]);           // All parts from backend
  const [filteredParts, setFilteredParts] = useState<Part[]>([]); // After filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<string[]>([]);       // For filter dropdown

  // Fetch parts on mount
  useEffect(() => {
    loadParts();
  }, []);

  async function loadParts() {
    try {
      setLoading(true);
      setError(null);
      const data = await getParts();
      setParts(data);
      setFilteredParts(data);

      // Extract unique brands from parts
      const uniqueBrands = Array.from(
        new Set(data.map((p) => p.brand).filter(Boolean))
      );
      setBrands(uniqueBrands as string[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load parts");
    } finally {
      setLoading(false);
    }
  }

  // Apply filters from PartsFilter component
  function applyFilters(newFilters: FilterOptions) {
    let result = [...parts];

    if (newFilters.minPrice !== undefined) {
      result = result.filter((p) => !p.price || p.price >= newFilters.minPrice!);
    }

    if (newFilters.maxPrice !== undefined) {
      result = result.filter((p) => !p.price || p.price <= newFilters.maxPrice!);
    }

    if (newFilters.brand) {
      result = result.filter((p) =>
        p.brand?.toLowerCase().includes(newFilters.brand!.toLowerCase())
      );
    }

    if (newFilters.inStockOnly) {
      // Adjust based on actual backend field name
      result = result.filter((p) => p.compatibility !== "Out of Stock");
    }

    setFilteredParts(result);
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">Error</h2>
          <p className="mt-2 text-red-700">{error}</p>
          <button
            onClick={loadParts}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <h1 className="mb-2 text-3xl font-bold">PC Components</h1>
      <p className="mb-8 text-gray-600">Browse and select components for your build</p>

      {/* Layout: Sidebar + Grid */}
      <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-5">
        {/* Left Sidebar - Filters */}
        <div>
          <PartsFilter onFilterChange={applyFilters} brands={brands} />

          {/* Category Shortcuts */}
          <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Browse by Category</h3>
            <div className="space-y-2">
              {["cpu", "gpu", "ram", "storage", "motherboard", "psu", "case", "cooler"].map((cat) => (
                <Link
                  key={cat}
                  href={`/parts/category/${cat}`}
                  className="block rounded px-2 py-1 text-sm capitalize hover:bg-gray-100"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Parts Grid */}
        <div className="md:col-span-3 lg:col-span-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-gray-500">Loading parts...</p>
            </div>
          ) : filteredParts.length === 0 ? (
            <div className="flex justify-center py-12">
              <p className="text-gray-500">No parts found matching your filters</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredParts.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          )}

          {!loading && filteredParts.length > 0 && (
            <p className="mt-6 text-sm text-gray-500">
              Showing {filteredParts.length} of {parts.length} parts
            </p>
          )}
        </div>
      </div>
    </div>
  );
}