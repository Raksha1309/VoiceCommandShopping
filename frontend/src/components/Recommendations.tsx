import { useState, useEffect } from "react";
import ProductGrid from "./ProductGrid";
import { Loader2 } from "lucide-react";

export default function Recommendations({ 
  onAdd 
}: { 
  onAdd: (productName: string) => void 
}) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/api/recommendations/`);
        if (!res.ok) throw new Error("Failed to load recommendations");
        const data = await res.json();
        
        // Add fake properties if backend doesn't provide them
        const processed = data.recommendations.map((name: string, i: number) => ({
          id: 500 + i,
          name: name,
          price: 30 + (i * 10),
          weight: "1 unit",
          rating: 4.5 + (Math.random() * 0.5),
          image: "⭐"
        }));
        
        setRecommendations(processed);
      } catch (err) {
        setError("Unable to load recommendations at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [API_URL]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-purple-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-white font-medium animate-pulse">Analyzing your preferences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-text-muted animate-in fade-in">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-2xl">⚠️</div>
        <p className="text-white font-medium text-lg">{error}</p>
        <p className="text-sm mt-2">Something went wrong connecting to the shopping service.</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 px-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span className="text-3xl">✨</span> Recommended for You
        </h1>
        <p className="text-text-muted mt-2 text-lg">Based on your shopping history and preferences.</p>
      </div>
      <ProductGrid products={recommendations} title="" onAdd={onAdd} />
    </div>
  );
}
