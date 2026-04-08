"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function WissenSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Update URL when debounced query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.push(`/wissen?${params.toString()}`);
  }, [debouncedQuery, searchParams, router]);

  const handleClear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Artikel suchen..."
          className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-darkerGray placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-darkerGray transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
