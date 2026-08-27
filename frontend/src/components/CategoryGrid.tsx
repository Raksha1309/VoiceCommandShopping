export default function CategoryGrid() {
  const categories = [
    { name: "Dairy", items: "12 items", icon: "🥛" },
    { name: "Bakery", items: "8 items", icon: "🍞" },
    { name: "Fruits & Veg", items: "18 items", icon: "🥦" },
    { name: "Snacks", items: "15 items", icon: "🍟" },
    { name: "Beverages", items: "10 items", icon: "🥤" },
    { name: "Household", items: "20 items", icon: "🧼" },
  ];

  return (
    <div className="px-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Shop by Categories</h3>
        <button className="text-purple-400 text-sm hover:text-purple-300 font-medium transition-colors flex items-center gap-1">
          View All <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="glass-card p-4 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-white/10 transition-all border border-white/5 hover:border-purple-500/30 rounded-2xl">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-md">
              {cat.icon}
            </div>
            <h4 className="text-white font-medium text-sm mb-1">{cat.name}</h4>
            <p className="text-xs text-text-muted">{cat.items}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
