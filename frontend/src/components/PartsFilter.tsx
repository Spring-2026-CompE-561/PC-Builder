"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FilterOptions {
  brand?: string;
  maxPrice?: number;
  minPrice?: number;
  inStockOnly?: boolean;
  sort?: "price_asc" | "price_desc";
  specKeys?: string[];
}

interface PartsFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  brands?: string[];
}

const specOptions = [
  "socket",
  "supported_ram",
  "type",
  "form_factor",
  "interface",
  "capacity_gb",
  "vram_type",
  "color",
  "wattage",
  "tdp",
];

export function PartsFilter({ onFilterChange, brands = [] }: PartsFilterProps) {
  // State for each filter input
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<FilterOptions["sort"]>(undefined);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((current) =>
      current.includes(spec)
        ? current.filter((item) => item !== spec)
        : [...current, spec]
    );
  };

  // Apply filters by calling the parent callback
  const handleApplyFilters = () => {
    onFilterChange({
      minPrice,
      maxPrice,
      brand: selectedBrand || undefined,
      inStockOnly,
      sort,
      specKeys: selectedSpecs.length > 0 ? selectedSpecs : undefined,
    });
  };

  // Clear all filters
  const handleReset = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedBrand("");
    setInStockOnly(false);
    setSort(undefined);
    setSelectedSpecs([]);
    onFilterChange({});
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      {/* Price Range */}
      <div className="mb-6 space-y-3">
        <Label>Price Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice ?? ""}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice ?? ""}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="mb-6 space-y-2">
          <Label>Brand</Label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sort */}
      <div className="mb-6 space-y-2">
        <Label>Sort by</Label>
        <select
          value={sort ?? ""}
          onChange={(e) =>
            setSort(e.target.value ? (e.target.value as FilterOptions["sort"]) : undefined)
          }
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Spec filter */}
      <div className="mb-6 space-y-3">
        <Label>Specs Listed</Label>
        <div className="grid gap-2">
          {specOptions.map((spec) => (
            <div key={spec} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`spec-${spec}`}
                checked={selectedSpecs.includes(spec)}
                onChange={() => toggleSpec(spec)}
              />
              <Label htmlFor={`spec-${spec}`} className="m-0 capitalize">
                {spec.replace(/_/g, " ")}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          id="inStock"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
        />
        <Label htmlFor="inStock" className="m-0">
          In Stock Only
        </Label>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleApplyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
}
