"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import RightSidebar from "@/components/RightSidebar";
import FeaturesBanner from "@/components/FeaturesBanner";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [systemMessage, setSystemMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchList = async () => {
    try {
      const res = await fetch(`${API_URL}/api/shopping/`);
      const data = await res.json();
      
      // The old backend returns items categorized, but RightSidebar expects a flat list
      // So we flatten it for the cart view
      let flatItems: any[] = [];
      if (data.items) {
        Object.values(data.items).forEach((catArray: any) => {
          flatItems = flatItems.concat(catArray);
        });
      }
      
      // Add fake prices and weights since backend shopping list doesn't provide them yet
      const processedItems = flatItems.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity || 1,
        price: 30.00, // mock price
        weight: "1 unit", // mock weight
        image: "🛒" // mock image
      }));
      
      setItems(processedItems);
    } catch (e) {
      console.error("Failed to fetch shopping list", e);
    }
  };

  useEffect(() => {
    fetchList();

    // Initialize Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setTranscript("");
        };

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptResult = event.results[current][0].transcript;
          setTranscript(transcriptResult);
          
          setIsProcessing(true);
          handleCommand(transcriptResult);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setSystemMessage("Microphone error. Please try again.");
          setTimeout(() => setSystemMessage(""), 3000);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

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

  const handleCommand = async (command: string) => {
    setSystemMessage(`Processing: "${command}"...`);
    setIsListening(true);
    
    try {
      const res = await fetch(`${API_URL}/api/voice/command`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: command })
      });
      
      const data = await res.json();
      setSystemMessage(data.message);
      
      // Refresh data
      fetchList();
      
      setTimeout(() => setSystemMessage(""), 4000);
    } catch (e) {
      setSystemMessage("Network error. Could not reach the assistant.");
      setTimeout(() => setSystemMessage(""), 3000);
    } finally {
      setIsListening(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/shopping/${id}`, { 
        method: "DELETE"
      });
      fetchList();
    } catch (e) {
      console.error(e);
    }
  };

  const manualAdd = (productName: string) => {
    handleCommand(`Add ${productName}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
        {/* System Message Overlay */}
        {systemMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 glass-panel border-purple-500/50 text-white text-sm py-2 px-6 rounded-full shadow-lg shadow-purple-500/20 animate-in slide-in-from-top-4 fade-in duration-300">
            {systemMessage}
          </div>
        )}

        <TopHeader onToggleVoice={toggleListen} />
        
        <div className="flex-1">
          <HeroSection onCommand={handleCommand} onToggleVoice={toggleListen} />
          <CategoryGrid />
          <ProductGrid onAdd={manualAdd} />
          <FeaturesBanner />
        </div>
      </main>

      {/* Right Sidebar (Cart & Voice) */}
      <RightSidebar 
        items={items} 
        onRemove={handleRemove} 
        onCheckout={() => setSystemMessage("Checkout coming soon!")}
        isListening={isListening}
        onToggleVoice={toggleListen}
      />
    </div>
  );
}
