import { ShoppingCart, Trash2, Plus, Minus, Lock } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  weight: string;
  image: string;
}

interface ShoppingListProps {
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: () => void;
}

export default function ShoppingList({ items, onRemove, onUpdateQuantity, onCheckout }: ShoppingListProps) {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Shopping List</h1>
          <p className="text-text-muted mt-2">{totalItems} items in your cart</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-20 text-text-muted">
          <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium text-white">Your cart is empty</p>
          <p className="text-sm mt-2">Add some items using voice or search.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="glass-card p-4 flex gap-4 items-center group transition-all hover:bg-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-3xl shrink-0">
                  {item.image || "🛒"}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-lg">{item.name}</h4>
                  <p className="text-sm text-text-muted">{item.weight}</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1 border border-white/10">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-text-muted hover:text-white transition-colors rounded-md hover:bg-white/10">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-white w-6 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-text-muted hover:text-white transition-colors rounded-md hover:bg-white/10">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-lg font-bold text-white w-24 text-right">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price * item.quantity)}
                  </span>
                  <button onClick={() => onRemove(item.id)} className="text-text-muted hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10 opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80">
            <div className="glass-card p-6 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-white">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(total)}
                  </span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Delivery Fee</span>
                  <span className="text-white">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(40)}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-white font-medium text-lg">Total</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-primary">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(total + 40)}
                  </span>
                </div>
              </div>

              <button 
                onClick={onCheckout}
                className="w-full bg-gradient-primary hover:scale-[1.02] transition-transform text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
