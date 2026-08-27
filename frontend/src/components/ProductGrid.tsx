import { Heart, Star, ShoppingCart } from "lucide-react";

export default function ProductGrid({ onAdd }: { onAdd: (name: string) => void }) {
  const products = [
    { name: "Amul Taaza Milk", weight: "1 L", price: 30.00, rating: 4.8, image: "🥛", isFav: false },
    { name: "Brown Bread", weight: "400 g", price: 40.00, rating: 4.6, image: "🍞", isFav: false },
    { name: "Eggs (6 pcs)", weight: "Fresh & White", price: 36.00, rating: 4.7, image: "🥚", isFav: false },
    { name: "Banana", weight: "1 Dozen", price: 50.00, rating: 4.5, image: "🍌", isFav: false },
    { name: "Aashirvaad Atta", weight: "5 kg", price: 249.00, rating: 4.9, image: "🌾", isFav: false },
  ];

  return (
    <div className="px-6 mt-10 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Popular Products</h3>
        <button className="text-purple-400 text-sm hover:text-purple-300 font-medium transition-colors flex items-center gap-1">
          View All <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product, idx) => (
          <div key={idx} className="glass-card p-4 flex flex-col rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className="text-5xl my-4 mx-auto filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                {product.image}
              </div>
              <button className="text-text-muted hover:text-pink-500 transition-colors">
                <Heart className={`w-5 h-5 ${product.isFav ? 'fill-pink-500 text-pink-500' : ''}`} />
              </button>
            </div>
            
            <h4 className="text-white font-medium text-sm line-clamp-1">{product.name}</h4>
            <p className="text-xs text-text-muted mb-2">{product.weight}</p>
            
            <div className="flex items-center gap-1 text-xs text-yellow-400 mb-3">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              <span className="font-medium text-white">{product.rating}</span>
            </div>
            
            <div className="mt-auto flex items-center justify-between">
              <span className="text-white font-bold text-lg">₹{product.price.toFixed(2)}</span>
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
