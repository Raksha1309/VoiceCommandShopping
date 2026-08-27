import { ShoppingCart, Trash2, Plus, Minus, Mic, AudioLines, Lock } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  weight: string;
  image: string;
}

export default function RightSidebar({ 
  items, 
  onRemove,
  onUpdateQuantity,
  onCheckout,
  isListening,
  onToggleVoice
}: { 
  items: CartItem[], 
  onRemove: (id: number) => void,
  onUpdateQuantity: (id: number, quantity: number) => void,
  onCheckout: () => void,
  isListening: boolean,
  onToggleVoice: () => void
}) {
  
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <aside className="w-80 h-screen border-l border-white/5 flex flex-col bg-surface overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
      
      {/* Cart Section */}
      <div className="p-6 flex-1 flex flex-col h-1/2 min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
            My Cart ({items.length})
          </h2>
          <button className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
            View Cart &rarr;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-text-muted">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  {item.image || "🛒"}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-white text-sm font-medium line-clamp-1">{item.name}</h4>
                    <button onClick={() => onRemove(item.id)} className="text-text-muted hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-text-muted mb-2">{item.weight}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-0.5 border border-white/10">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 text-text-muted hover:text-white"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-medium text-white w-4 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 text-text-muted hover:text-white"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="text-sm font-bold text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-4 border-t border-white/10 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-medium">Total</span>
              <span className="text-xl font-bold text-white">₹{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-gradient-primary hover:scale-[1.02] transition-transform text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Voice Assistant Widget */}
      <div className="p-6 border-t border-white/5 bg-black/20 relative overflow-hidden shrink-0 h-64 flex flex-col justify-center items-center">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <h3 className="text-white font-medium text-sm flex items-center gap-2 z-10 mb-2">
          <Mic className="w-4 h-4 text-purple-400" />
          Voice Assistant
        </h3>
        <p className="text-xs text-text-muted z-10 mb-6 text-center">Tap the mic and say what you need!</p>
        
        <div className="relative z-10 w-full flex flex-col items-center">
          {isListening && (
            <div className="absolute inset-0 flex items-center justify-center opacity-30 text-purple-400">
              <AudioLines className="w-full h-8 animate-pulse" />
            </div>
          )}
          
          <button onClick={onToggleVoice} className={`w-16 h-16 rounded-full flex items-center justify-center relative z-20 transition-transform ${isListening ? 'bg-gradient-primary scale-110 shadow-lg shadow-purple-500/50 animate-pulse-ring' : 'bg-surface-hover border border-purple-500/50 hover:bg-white/10 hover:border-purple-400 text-purple-400 hover:text-purple-300'}`}>
            <Mic className={`w-6 h-6 ${isListening ? 'text-white' : ''}`} />
          </button>
          
          <p className={`text-xs mt-4 font-medium transition-opacity ${isListening ? 'text-purple-400 opacity-100' : 'opacity-0'}`}>
            Listening... <span className="animate-pulse">|||</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
