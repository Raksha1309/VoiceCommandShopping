"use client";

import { useState, useEffect } from "react";
import VoiceButton from "@/components/VoiceButton";
import ShoppingList from "@/components/ShoppingList";
import Suggestions from "@/components/Suggestions";
import SearchBar from "@/components/SearchBar";
import { ShoppingCart } from "lucide-react";

export default function Home() {
  const [items, setItems] = useState<Record<string, any[]>>({});
  const [recommendations, setRecommendations] = useState({ history: [], seasonal: [] });
  const [systemMessage, setSystemMessage] = useState("");

  // Use the production Render URL or the environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
    : "https://voicecommandshopping.onrender.com/api";

  const fetchList = async () => {
    const timeoutId = setTimeout(() => {
      setSystemMessage("Waking up free server... This may take up to 50 seconds.");
    }, 2000);
    
    try {
      const res = await fetch(`${API_URL}/shopping`);
      clearTimeout(timeoutId);
      const data = await res.json();
      setItems(data.items || {});
      setSystemMessage((prev) => prev.includes("Waking up") ? "" : prev);
    } catch (e) {
      clearTimeout(timeoutId);
      console.error("Failed to fetch shopping list");
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`${API_URL}/recommendations`);
      const data = await res.json();
      setRecommendations(data);
    } catch (e) {
      console.error("Failed to fetch recommendations");
    }
  };

  useEffect(() => {
    fetchList();
    fetchRecommendations();
  }, []);

  const handleCommand = async (command: string) => {
    setSystemMessage(`Processing: "${command}"...`);
    
    try {
      const res = await fetch(`${API_URL}/voice/command`, {
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
      fetchRecommendations();
      
      // Clear message after 4 seconds
      setTimeout(() => setSystemMessage(""), 4000);
    } catch (e) {
      setSystemMessage("Network error. Could not reach the assistant.");
      setTimeout(() => setSystemMessage(""), 3000);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await fetch(`${API_URL}/shopping/${id}`, { 
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
    <main className="min-h-screen text-slate-100 pb-24 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 rounded-b-3xl border-t-0 mx-auto max-w-2xl mt-0">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight text-gradient">VoiceCart</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-8 relative z-10">
        {/* System Message Alert */}
        {systemMessage && (
          <div className="mb-8 glass-panel text-white text-sm py-3 px-6 rounded-2xl shadow-xl text-center animate-in slide-in-from-top-4 fade-in duration-300 border-purple-500/30 font-medium">
            {systemMessage}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-10">
          <SearchBar onAdd={manualAdd} />
        </div>

        <div className="flex justify-center my-10">
          <VoiceButton onCommand={handleCommand} />
        </div>
        
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full inline-block"></span>
            My Shopping List
          </h2>
          <ShoppingList items={items} onRemove={handleRemove} />
        </div>

        <div className="mt-12">
           <Suggestions 
            history={recommendations.history} 
            seasonal={recommendations.seasonal} 
            onAdd={manualAdd}
          />
        </div>
      </div>
    </main>
  );
}
