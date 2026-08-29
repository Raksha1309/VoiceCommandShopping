"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import FeaturesBanner from "@/components/FeaturesBanner";
import VoiceButton from "@/components/VoiceButton";
import ShoppingList from "@/components/ShoppingList";
import Recommendations from "@/components/Recommendations";
import SearchTab from "@/components/SearchTab";
import MyOrders from "@/components/MyOrders";
import Profile from "@/components/Profile";
import Settings from "@/components/Settings";
import CategoriesTab from "@/components/CategoriesTab";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [systemMessage, setSystemMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const [products, setProducts] = useState<any[]>([
    { id: 101, name: "Amul Taaza Milk", weight: "1 L", price: 30.00, rating: 4.8, image: "🥛", isFav: false },
    { id: 102, name: "Brown Bread", weight: "400 g", price: 40.00, rating: 4.6, image: "🍞", isFav: false },
    { id: 103, name: "Eggs (6 pcs)", weight: "Fresh & White", price: 36.00, rating: 4.7, image: "🥚", isFav: false },
    { id: 104, name: "Banana", weight: "1 Dozen", price: 50.00, rating: 4.5, image: "🍌", isFav: false },
    { id: 105, name: "Aashirvaad Atta", weight: "5 kg", price: 249.00, rating: 4.9, image: "🌾", isFav: false },
  ]);
  const [productsTitle, setProductsTitle] = useState("Popular Products");
  const [activeSection, setActiveSection] = useState("Home");

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

  const searchProducts = async (query: string) => {
    try {
      const res = await fetch(`${API_URL}/api/search/?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setProducts(data.results);
        setProductsTitle(`Search Results: ${query}`);
      } else {
        setSystemMessage(`No products found for "${query}"`);
      }
    } catch (e) {
      console.error(e);
      setSystemMessage("Search failed");
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
      
      if (data.intent === "search" && data.item) {
        searchProducts(data.item);
      } else {
        // Refresh cart data for add/remove
        fetchList();
      }
      
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

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    try {
      await fetch(`${API_URL}/api/shopping/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      });
      fetchList();
    } catch (e) {
      console.error("Failed to update quantity", e);
    }
  };

  const handleSidebarNav = (label: string) => {
    setActiveSection(label);
  };

  const manualAdd = (productName: string) => {
    handleCommand(`Add ${productName}`);
  };

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar */}
      <Sidebar cartItemCount={cartItemCount} onNavClick={handleSidebarNav} activeItem={activeSection} />

      {/* Main Content Area */}
      <main id="main-scroll-area" className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
        {/* System Message Overlay */}
        {systemMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 glass-panel border-purple-500/50 text-white text-sm py-2 px-6 rounded-full shadow-lg shadow-purple-500/20 animate-in slide-in-from-top-4 fade-in duration-300">
            {systemMessage}
          </div>
        )}

        <div className="flex-1 pb-24">
          {activeSection === "Home" && (
            <div className="animate-in fade-in duration-500">
              <TopHeader onToggleVoice={toggleListen} onSearch={(q) => {
                setActiveSection("Search");
                searchProducts(q);
              }} />
              <HeroSection onCommand={handleCommand} onToggleVoice={toggleListen} />
              <ProductGrid products={products} title={productsTitle} onAdd={manualAdd} />
              <FeaturesBanner />
            </div>
          )}

          {activeSection === "Search" && (
            <SearchTab 
              onToggleVoice={toggleListen}
              onSearch={searchProducts}
              products={products}
              title={productsTitle}
              onAdd={manualAdd}
              isSearching={false} // Would need a new state for true loading, but keeping simple for now
            />
          )}

          {activeSection === "My Cart" && (
            <ShoppingList 
              items={items}
              onRemove={handleRemove}
              onUpdateQuantity={handleUpdateQuantity}
              onCheckout={() => {
                // Generate simple order
                const newOrder = {
                  id: `VC${Math.floor(1000 + Math.random() * 9000)}`,
                  date: new Date().toISOString(),
                  status: "Processing",
                  total: items.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 40,
                  items: [...items]
                };
                
                const existing = localStorage.getItem("voicecart_orders");
                const parsed = existing ? JSON.parse(existing) : [];
                localStorage.setItem("voicecart_orders", JSON.stringify([newOrder, ...parsed]));
                
                // Clear cart (frontend & backend)
                handleCommand("Clear my cart");
                setSystemMessage("Order placed successfully! Check My Orders.");
                setActiveSection("My Orders");
                setTimeout(() => setSystemMessage(""), 3000);
              }}
            />
          )}

          {activeSection === "Recommendations" && (
            <Recommendations onAdd={manualAdd} />
          )}

          {activeSection === "Categories" && (
            <CategoriesTab onAdd={manualAdd} />
          )}

          {activeSection === "My Orders" && (
            <MyOrders />
          )}

          {activeSection === "Profile" && (
            <Profile />
          )}

          {activeSection === "Settings" && (
            <Settings />
          )}
        </div>
      </main>

      {/* Global Voice Button */}
      <VoiceButton isListening={isListening} onToggleVoice={toggleListen} />
    </div>
  );
}

