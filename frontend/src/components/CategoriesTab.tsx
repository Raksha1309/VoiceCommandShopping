import { useState, useEffect } from "react";
import CategoryGrid from "./CategoryGrid";
import ProductGrid from "./ProductGrid";
import { ArrowLeft, Layers } from "lucide-react";

export default function CategoriesTab({ onAdd }: { onAdd: (productName: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/search/?query=${category}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data.results || []);
    } catch (err) {
      setError(`Unable to load products for ${category}`);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {!selectedCategory ? (
        <div className="px-8 pb-12 animate-in fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Layers className="w-8 h-8 text-purple-400" /> Shop by Category
            </h1>
            <p className="text-text-muted mt-2 text-lg">Browse our wide selection of fresh products.</p>
          </div>
          <CategoryGrid onCategoryClick={handleCategorySelect} />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4">
          <div className="px-8 mb-6 flex items-center gap-4">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white capitalize">{selectedCategory} Products</h1>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-purple-400">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white font-medium animate-pulse">Loading {selectedCategory}...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <p className="text-white font-medium text-lg">{error}</p>
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} title="" onAdd={onAdd} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <p className="text-white font-medium text-lg">No products found in {selectedCategory}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
