"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceButtonProps {
  onCommand: (command: string) => void;
}

export default function VoiceButton({ onCommand }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        // recognitionRef.current.lang = 'en-US'; // We could add language support here

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setTranscript("");
        };

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptResult = event.results[current][0].transcript;
          setTranscript(transcriptResult);
          
          // Send to parent component for processing
          setIsProcessing(true);
          onCommand(transcriptResult);
          setIsProcessing(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setTranscript("Microphone error. Please try again.");
          setTimeout(() => setTranscript(""), 3000);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [onCommand]);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 my-2 relative">
      <div className="relative">
        {/* Glow effect behind button */}
        {isListening && (
          <div className="absolute inset-0 rounded-full animate-pulse-glow" />
        )}
        
        <button
          onClick={toggleListen}
          disabled={isProcessing}
          className={`relative z-10 p-8 rounded-full transition-all duration-500 shadow-xl ${
            isListening 
              ? "bg-gradient-to-br from-indigo-500 to-purple-600 scale-105" 
              : isProcessing
              ? "bg-slate-800/80 backdrop-blur-md cursor-not-allowed"
              : "bg-slate-800 hover:bg-slate-700 hover:scale-[1.02] border border-white/5"
          } text-white`}
        >
          {isProcessing ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isListening ? (
            <Mic className="w-10 h-10 animate-bounce" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </button>
      </div>

      <div className="h-10 text-center font-medium mt-2">
        {isListening && <p className="text-indigo-400 animate-pulse tracking-wide">Listening...</p>}
        {isProcessing && <p className="text-slate-400 tracking-wide">Processing command...</p>}
        {transcript && !isListening && !isProcessing && (
          <p className="text-slate-300 italic text-lg glass-pill px-4 py-1 rounded-full inline-block">"{transcript}"</p>
        )}
      </div>
    </div>
  );
}
