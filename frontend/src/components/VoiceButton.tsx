import { Mic, AudioLines } from "lucide-react";

interface VoiceButtonProps {
  isListening: boolean;
  onToggleVoice: () => void;
}

export default function VoiceButton({ isListening, onToggleVoice }: VoiceButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center">
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 bg-purple-500/20 rounded-full animate-ping"></div>
        </div>
      )}
      
      <button 
        onClick={onToggleVoice} 
        className={`w-16 h-16 rounded-full flex items-center justify-center relative z-20 transition-transform ${isListening ? 'bg-gradient-primary scale-110 shadow-[0_0_30px_rgba(168,85,247,0.5)]' : 'bg-surface border-2 border-purple-500/30 hover:border-purple-400 hover:bg-white/5 text-purple-400 hover:text-purple-300 shadow-xl'}`}
      >
        <Mic className={`w-7 h-7 ${isListening ? 'text-white' : ''}`} />
      </button>
      
      {isListening && (
        <div className="absolute bottom-[-24px] text-xs font-medium text-purple-400 animate-pulse whitespace-nowrap bg-black/50 px-3 py-1 rounded-full backdrop-blur-md border border-purple-500/20">
          Listening... <span className="animate-pulse">|||</span>
        </div>
      )}
    </div>
  );
}
