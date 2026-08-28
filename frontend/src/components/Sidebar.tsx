import { Home, Search, ShoppingCart, LayoutGrid, Sparkles, Package, User, Settings, Moon } from "lucide-react";

export default function Sidebar({
  cartItemCount,
  onNavClick
}: {
  cartItemCount?: number;
  onNavClick?: (label: string) => void;
}) {
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search" },
    { icon: ShoppingCart, label: "My Cart", badge: cartItemCount || 0 },
    { icon: LayoutGrid, label: "Categories" },
    { icon: Sparkles, label: "Recommendations" },
    { icon: Package, label: "My Orders" },
    { icon: User, label: "Profile" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 h-screen border-r border-white/5 flex flex-col bg-surface overflow-y-auto">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-gradient-primary p-2 rounded-xl shadow-lg shadow-purple-500/20">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <h1 className="font-extrabold text-2xl tracking-tight text-white">VoiceCart</h1>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item, idx) => {
          const badge = item.badge ?? 0;
          return (
            <button 
              key={idx} 
              onClick={() => onNavClick && onNavClick(item.label)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.active ? 'text-indigo-400' : ''}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {badge > 0 && (
                <span className="bg-indigo-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-card p-4 relative overflow-hidden rounded-2xl border border-purple-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
          <h3 className="text-white font-bold text-sm mb-1">🎉 Special Offer</h3>
          <p className="text-xs text-text-muted mb-3">Get 10% off on your first order</p>
          <div className="text-xs text-text-muted mb-3">Use code: <span className="text-white font-mono bg-white/10 px-2 py-1 rounded">VOICE10</span></div>
          <button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors border border-white/10">
            Shop Now →
          </button>
        </div>
        
        <div className="mt-4 px-2 flex items-center justify-between text-text-muted">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Moon className="w-4 h-4" /> Dark Mode
          </div>
          <div className="w-10 h-6 bg-purple-500 rounded-full flex items-center px-1">
            <div className="w-4 h-4 bg-white rounded-full shadow-sm ml-auto" />
          </div>
        </div>
      </div>
    </aside>
  );
}
