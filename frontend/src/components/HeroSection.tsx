import { Search, Mic } from "lucide-react";

export default function HeroSection({ onCommand, onToggleVoice }: { onCommand?: (cmd: string) => void, onToggleVoice?: () => void }) {
  const suggestions = [
    { text: "Add milk", icon: <Mic className="w-3.5 h-3.5 text-purple-400" /> },
    { text: "Show my cart", icon: <Mic className="w-3.5 h-3.5 text-purple-400" /> },
    { text: "Find eggs", icon: <Mic className="w-3.5 h-3.5 text-purple-400" /> },
    { text: "Suggest snacks", icon: <Mic className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  return (
    <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between">
      <div className="flex-1 max-w-2xl relative z-10">
        <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          Hi <span className="text-gradient">Raksha!</span> <span className="text-3xl">👋</span>
        </h2>
        <p className="text-text-muted text-lg mb-8">What can I help you add to your cart today?</p>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg animate-pulse-glow"></div>
          <div className="relative bg-surface border border-purple-500/30 rounded-full p-2 flex items-center shadow-2xl">
            <Search className="w-5 h-5 text-text-muted ml-3" />
            <input 
              type="text" 
              placeholder="Search or say something..." 
              className="flex-1 bg-transparent border-none py-2.5 px-4 text-white placeholder:text-text-muted focus:outline-none focus:ring-0"
            />
            <button onClick={onToggleVoice} className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs text-text-muted mb-3 font-medium">Try saying:</p>
          <div className="flex flex-wrap gap-3">
            {suggestions.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => onCommand && onCommand(item.text)}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white/5 transition-colors text-sm text-slate-200"
              >
                {item.icon}
                {item.text}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative Cart Image / Illustration */}
      <div className="hidden md:block relative w-80 h-64 mt-8 md:mt-0">
        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl"></div>
        {/* We use a placeholder emoji/icon for the 3D cart since we don't have the asset */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-9xl filter drop-shadow-2xl opacity-90 animate-bounce" style={{animationDuration: '3s'}}>
            🛒
          </div>
          {/* Floating decorative elements */}
          <div className="absolute top-0 right-10 text-2xl animate-pulse">✨</div>
          <div className="absolute bottom-10 left-0 text-3xl animate-bounce" style={{animationDuration: '4s'}}>🍎</div>
          <div className="absolute top-1/4 left-10 text-2xl animate-pulse" style={{animationDelay: '1s'}}>🥛</div>
        </div>
      </div>
    </div>
  );
}
