import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Shield, CreditCard, LogOut, Save } from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Raksha",
    email: "raksha@example.com",
    phone: "+91 98765 43210",
    address: "123 Tech Park, Bengaluru, Karnataka"
  });

  useEffect(() => {
    const saved = localStorage.getItem("voicecart_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("voicecart_profile", JSON.stringify(profile));
    setIsEditing(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <User className="w-8 h-8 text-purple-400" /> My Profile
        </h1>
        <p className="text-text-muted mt-2 text-lg">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Stats */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center border border-white/5">
            <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl text-white font-bold mb-4 shadow-lg shadow-purple-500/20">
              {profile.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            <p className="text-text-muted text-sm">{profile.email}</p>
            
            <div className="w-full mt-6 pt-6 border-t border-white/10 flex justify-around text-center">
              <div>
                <p className="text-white font-bold text-lg">12</p>
                <p className="text-text-muted text-xs uppercase tracking-wider">Orders</p>
              </div>
              <div>
                <p className="text-white font-bold text-lg">4</p>
                <p className="text-text-muted text-xs uppercase tracking-wider">Saved</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-white/5 space-y-2">
            <button className="w-full flex items-center gap-3 text-white hover:bg-white/5 p-3 rounded-xl transition-colors text-left">
              <Shield className="w-5 h-5 text-purple-400" /> 
              <span className="font-medium">Security settings</span>
            </button>
            <button className="w-full flex items-center gap-3 text-white hover:bg-white/5 p-3 rounded-xl transition-colors text-left">
              <CreditCard className="w-5 h-5 text-purple-400" /> 
              <span className="font-medium">Payment methods</span>
            </button>
            <button className="w-full flex items-center gap-3 text-red-400 hover:bg-red-400/10 p-3 rounded-xl transition-colors text-left mt-4">
              <LogOut className="w-5 h-5" /> 
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Column: Details Form */}
        <div className="md:col-span-2">
          <div className="glass-panel rounded-2xl p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Personal Information</h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  {isEditing ? (
                    <input 
                      value={profile.name}
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <p className="text-white font-medium px-4 py-2.5 bg-white/5 rounded-xl border border-transparent">{profile.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  {isEditing ? (
                    <input 
                      value={profile.email}
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <p className="text-white font-medium px-4 py-2.5 bg-white/5 rounded-xl border border-transparent">{profile.email}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </label>
                  {isEditing ? (
                    <input 
                      value={profile.phone}
                      onChange={e => setProfile({...profile, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <p className="text-white font-medium px-4 py-2.5 bg-white/5 rounded-xl border border-transparent">{profile.phone}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Delivery Address
                  </label>
                  {isEditing ? (
                    <textarea 
                      value={profile.address}
                      onChange={e => setProfile({...profile, address: e.target.value})}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                  ) : (
                    <p className="text-white font-medium px-4 py-2.5 bg-white/5 rounded-xl border border-transparent min-h-[5rem]">{profile.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
