import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Moon, Sun, Mic, Globe, Bell, ShoppingBag, Volume2, Shield } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    darkMode: true,
    voiceCommands: true,
    voiceLanguage: "English",
    currency: "INR ₹",
    showUnavailable: false,
    orderNotifications: true,
    recommendationAlerts: true
  });

  useEffect(() => {
    const saved = localStorage.getItem("voicecart_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSetting = (key: string, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem("voicecart_settings", JSON.stringify(updated));
  };

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) => (
    <button 
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-purple-500' : 'bg-white/20'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-purple-400" /> Settings
        </h1>
        <p className="text-text-muted mt-2 text-lg">Customize your VoiceCart experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Appearance */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-purple-400" /> Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white font-medium">Dark Mode</span>
              <Toggle checked={settings.darkMode} onChange={c => updateSetting("darkMode", c)} />
            </div>
            <p className="text-xs text-text-muted">High contrast theme optimized for comfortable viewing.</p>
          </div>
        </div>

        {/* Voice Shopping */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-400" /> Voice Shopping
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white font-medium">Voice Commands</span>
              <Toggle checked={settings.voiceCommands} onChange={c => updateSetting("voiceCommands", c)} />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white font-medium">Voice Language</span>
              <select 
                value={settings.voiceLanguage}
                onChange={e => updateSetting("voiceLanguage", e.target.value)}
                className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shopping */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" /> Shopping
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white font-medium">Currency</span>
              <select 
                value={settings.currency}
                onChange={e => updateSetting("currency", e.target.value)}
                className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="INR ₹">INR ₹</option>
                <option value="USD $">USD $</option>
              </select>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white font-medium">Show unavailable items</span>
              <Toggle checked={settings.showUnavailable} onChange={c => updateSetting("showUnavailable", c)} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" /> Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white font-medium">Order notifications</span>
              <Toggle checked={settings.orderNotifications} onChange={c => updateSetting("orderNotifications", c)} />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white font-medium">Recommendation alerts</span>
              <Toggle checked={settings.recommendationAlerts} onChange={c => updateSetting("recommendationAlerts", c)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
