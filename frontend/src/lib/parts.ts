import { apiFetch } from "./api";

export type Part = {
  id: number;
  name: string;
  category: string;
  brand: string;
  price?: number;

  // optional because backend may vary
  compatibility?: string;
  specs?: Record<string, any>;
};

/**
 * Get all parts
 */
export async function getParts(): Promise<Part[]> {
  return apiFetch<Part[]>("/parts"); 
  // if this fails → change to "/api/parts"
}

/**
 * Get parts by category (cpu, gpu, etc.)
 */
export async function getPartsByCategory(category: string): Promise<Part[]> {
  return apiFetch<Part[]>(`/parts/category/${category}`);
}

/**
 * Get one part by ID
 */
export async function getPartById(id: string): Promise<Part> {
  return apiFetch<Part>(`/parts/${id}`);
}