"use client";

import { Check, Trash2 } from "lucide-react";

interface ShoppingListProps {
  items: Record<string, any[]>;
  onRemove: (id: number) => void;
}

export default function ShoppingList({ items, onRemove }: ShoppingListProps) {
  const categories = Object.keys(items);

  if (categories.length === 0) {
    return (
      <div className="text-center text-slate-400 my-10 glass-card rounded-2xl p-8 border-dashed">
        <p className="text-lg">Your shopping list is empty.</p>
        <p className="text-sm mt-2 opacity-70">Tap the glowing mic and say "Add milk".</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {categories.map((category) => (
        <div key={category} className="glass-panel rounded-2xl overflow-hidden group">
          <div className="bg-slate-800/40 px-5 py-3 border-b border-white/5 font-semibold text-slate-200 tracking-wide text-sm flex items-center justify-between">
            {category}
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              {items[category].length} items
            </span>
          </div>
          <ul className="divide-y divide-white/5">
            {items[category].map((item) => (
              <li key={item.id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center text-transparent hover:text-emerald-400 hover:border-emerald-400 hover:bg-emerald-400/10 cursor-pointer transition-all shadow-inner">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-100 capitalize font-medium">{item.name}</span>
                  <span className="text-xs font-bold bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-md border border-pink-500/20">
                    × {item.quantity}
                  </span>
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 p-2 rounded-full transition-all"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
