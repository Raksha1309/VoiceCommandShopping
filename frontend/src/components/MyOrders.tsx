import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle2, ChevronRight, Truck } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("voicecart_orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Mock some previous orders if empty for demo purposes
      const mockOrders = [
        {
          id: "VC1024",
          date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          status: "Delivered",
          total: 135,
          items: [
            { name: "Amul Taaza Milk", quantity: 2, price: 30 },
            { name: "Potatoes", quantity: 1, price: 40 },
            { name: "Bread", quantity: 1, price: 35 }
          ]
        },
        {
          id: "VC1023",
          date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
          status: "Delivered",
          total: 220,
          items: [
            { name: "Biscuits", quantity: 3, price: 40 },
            { name: "Almond Milk", quantity: 1, price: 100 }
          ]
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem("voicecart_orders", JSON.stringify(mockOrders));
    }
  }, []);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(price);
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-text-muted animate-in fade-in">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-4xl">
          <Package className="w-10 h-10" />
        </div>
        <p className="text-white font-medium text-xl">No orders yet</p>
        <p className="text-sm mt-2 text-center max-w-md">When you place an order, it will show up here.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Package className="w-8 h-8 text-purple-400" /> My Orders
        </h1>
        <p className="text-text-muted mt-2 text-lg">View and manage your recent purchases.</p>
      </div>

      <div className="space-y-6">
        {orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order) => (
          <div key={order.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
            {/* Order Header */}
            <div className="bg-white/5 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-white/5">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-bold text-lg">Order #{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
                    ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {order.status === 'Delivered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                    {order.status}
                  </span>
                </div>
                <p className="text-text-muted text-sm mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {formatDate(order.date)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-text-muted text-sm mb-1">Total Amount</p>
                <p className="text-white font-bold text-xl">{formatPrice(order.total)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                        📦
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-text-muted text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-white font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/5 text-right">
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 ml-auto transition-colors group">
                  View Details
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
