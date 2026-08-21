"use client";

import { Lightbulb, Plus } from "lucide-react";

interface SuggestionsProps {
  history: any[];
  seasonal: any[];
  onAdd: (productName: string) => void;
}

export default function Suggestions({ history, seasonal, onAdd }: SuggestionsProps) {
  if (history.length === 0 && seasonal.length === 0) return null;

  return (
    <div className="w-full mt-8 glass-panel rounded-2xl p-6 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 font-semibold relative z-10">
        <div className="bg-slate-800 p-2 rounded-xl shadow-inner border border-white/5">
          <Lightbulb className="w-5 h-5 text-indigo-400 drop-shadow-md" />
        </div>
        <h2 className="text-xl text-slate-100">Smart Suggestions</h2>
      </div>

      <div className="space-y-6 relative z-10">
        {history.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-bold flex items-center gap-2">
              <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
              Based on your history
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {history.map((item, idx) => (
                <button
                  key={`hist-${idx}`}
                  onClick={() => onAdd(item.name)}
                  className="flex items-center gap-1.5 glass-pill text-sm px-4 py-2 rounded-full font-medium text-purple-200"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                  <span className="capitalize">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {seasonal.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-bold flex items-center gap-2">
              <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
              Seasonal Items
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {seasonal.map((item, idx) => (
                <button
                  key={`seas-${idx}`}
                  onClick={() => onAdd(item.name)}
                  className="flex items-center gap-1.5 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50 hover:-translate-y-0.5 shadow-[0_0_0_rgba(16,185,129,0)] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-sm px-4 py-2 rounded-full transition-all font-medium text-emerald-200"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="capitalize">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
