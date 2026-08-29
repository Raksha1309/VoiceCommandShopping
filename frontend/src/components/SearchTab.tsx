import TopHeader from "./TopHeader";
import ProductGrid from "./ProductGrid";
import { Loader2 } from "lucide-react";

interface SearchTabProps {
  onToggleVoice: () => void;
  onSearch: (query: string) => void;
  products: any[];
  title: string;
  onAdd: (productName: string) => void;
  isSearching?: boolean;
}

export default function SearchTab({
  onToggleVoice,
  onSearch,
  products,
  title,
  onAdd,
  isSearching = false
}: SearchTabProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <TopHeader onToggleVoice={onToggleVoice} onSearch={onSearch} />
      
      {isSearching ? (
        <div className="flex flex-col items-center justify-center h-64 text-purple-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-white font-medium animate-pulse">Searching catalog...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="mt-8">
          <ProductGrid products={products} title={title} onAdd={onAdd} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-text-muted">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-4xl">🔍</div>
          <p className="text-white font-medium text-xl">Search for products</p>
          <p className="text-sm mt-2 text-center max-w-md">Try searching for "Milk", "Bread", or use the voice assistant to find what you need.</p>
        </div>
      )}
    </div>
  );
}
