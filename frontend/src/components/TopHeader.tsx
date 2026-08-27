import { Search, Mic, Bell, Moon } from "lucide-react";

export default function TopHeader({ onToggleVoice, onSearch }: { onToggleVoice?: () => void, onSearch?: (q: string) => void }) {
  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex-1 flex items-center gap-4 max-w-xl">
        <button className="p-2 text-text-muted hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search for products (e.g., milk, bread, eggs...)" 
            className="w-full bg-surface-hover/50 border border-white/5 rounded-full py-2.5 pl-10 pr-12 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-purple-500/50 transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim() && onSearch) {
                onSearch(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button onClick={onToggleVoice} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Mic className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-text-muted hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border border-surface"></span>
        </button>
        <button className="p-2 text-text-muted hover:text-white transition-colors">
          <Moon className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
          <span className="text-sm font-medium text-white hidden sm:block">Raksha Ojha</span>
          <svg className="w-4 h-4 text-text-muted hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </header>
  );
}
