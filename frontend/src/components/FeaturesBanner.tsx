import { Truck, Lock, RotateCcw, Headset } from "lucide-react";

export default function FeaturesBanner() {
  const features = [
    { icon: Truck, title: "Fast Delivery", desc: "Get your items in 30 mins" },
    { icon: Lock, title: "Secure Payments", desc: "100% safe & secure" },
    { icon: RotateCcw, title: "Easy Returns", desc: "Hassle free returns", iconColor: "text-pink-400" },
    { icon: Headset, title: "24/7 Support", desc: "We're here to help" },
  ];

  return (
    <div className="px-6 pb-6">
      <div className="glass-panel rounded-2xl flex flex-wrap md:flex-nowrap items-center justify-between p-4 gap-4">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-center gap-3 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
              <feat.icon className={`w-5 h-5 ${feat.iconColor || 'text-purple-400'}`} />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">{feat.title}</h4>
              <p className="text-xs text-text-muted">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
