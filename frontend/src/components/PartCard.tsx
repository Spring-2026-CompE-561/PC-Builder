import Link from "next/link";
import type { Part } from "@/lib/parts";

export default function PartCard({ part }: { part: Part }) {
  return (
    <Link href={`/parts/${part.id}`}>
      <div className="rounded-lg border p-4 shadow-sm transition hover:shadow-md">
        <p className="text-sm text-gray-500">{part.category}</p>
        <h2 className="mt-1 text-xl font-semibold">{part.name}</h2>
        <p className="mt-2">Brand: {part.brand}</p>
        <p className="mt-1 font-bold">
          {part.price ? `$${part.price}` : "Price unavailable"}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {part.in_stock ? "In stock" : "Out of stock"}
        </p>
      </div>
    </Link>
  );
}
