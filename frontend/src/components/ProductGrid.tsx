import { useState } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
  aliases: string;
  // Allow extra fields for our UI defaults
  weight?: string;
  rating?: number;
  image?: string;
  isFav?: boolean;
}

export default function ProductGrid({ 
  products, 
  title = "Popular Products",
  onAdd 
}: { 
  products: Product[],
  title?: string,
  onAdd: (name: string) => void 
}) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFav = (id: number) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) {
      newFavs.delete(id);
    } else {
      newFavs.add(id);
    }
    setFavorites(newFavs);
  };

  return (
    <div className="px-6 mt-10 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <button className="text-purple-400 text-sm hover:text-purple-300 font-medium transition-colors flex items-center gap-1">
          View All <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product, idx) => (
          <div key={idx} className="glass-card p-4 flex flex-col rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className="text-5xl my-4 mx-auto filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                {product.image || "🛒"}
              </div>
              <button onClick={() => toggleFav(product.id)} className="text-text-muted hover:text-pink-500 transition-colors">
                <Heart className={`w-5 h-5 ${favorites.has(product.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
              </button>
            </div>
            
            <h4 className="text-white font-medium text-sm line-clamp-1">{product.name}</h4>
            <p className="text-xs text-text-muted mb-2">{product.weight || "1 unit"}</p>
            
            <div className="flex items-center gap-1 text-xs text-yellow-400 mb-3">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              <span className="font-medium text-white">{product.rating || 4.5}</span>
            </div>
            
            <div className="mt-auto flex items-center justify-between">
              <span className="text-white font-bold text-lg">₹{product.price?.toFixed(2)}</span>
              <button 
                onClick={() => onAdd(product.name)}
                className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
