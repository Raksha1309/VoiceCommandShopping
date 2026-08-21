"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Plus } from "lucide-react";

interface SearchBarProps {
  onAdd: (productName: string) => void;
}

export default function SearchBar({ onAdd }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data.results || []);
        } catch (e) {
          console.error("Failed to search products");
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleAdd = (productName: string) => {
    onAdd(productName);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full z-20">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products to add..."
          className="w-full bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-full py-3.5 pl-12 pr-12 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-lg"
        />
        {isSearching && (
          <div className="absolute right-4 text-indigo-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto z-30">
          <ul className="divide-y divide-white/5">
            {results.map((product) => (
              <li 
                key={product.id} 
                className="px-4 py-3 hover:bg-slate-700/50 flex items-center justify-between cursor-pointer transition-colors"
                onClick={() => handleAdd(product.name)}
              >
                <div>
                  <div className="text-slate-200 font-medium capitalize">{product.name}</div>
                  <div className="text-xs text-slate-400">{product.category} • ${product.price?.toFixed(2)}</div>
                </div>
                <button className="bg-indigo-500/20 text-indigo-300 p-1.5 rounded-full hover:bg-indigo-500/40 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
