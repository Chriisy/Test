import React, { useState } from 'react';
import { Home, AlertTriangle, Users, Building2, Settings, Wrench, Search, Bell, ChevronRight, Clock, CheckCircle, MapPin, Camera, ClipboardList, User } from 'lucide-react';

export default function MyhrvoldgruppenDemo() {
  const [activeView, setActiveView] = useState('desktop');
  const [activePage, setActivePage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null },
    { id: 'claims', icon: AlertTriangle, label: 'Reklamasjoner', badge: '23' },
    { id: 'customers', icon: Users, label: 'Kunder', badge: '207' },
    { id: 'suppliers', icon: Building2, label: 'Leverandører', badge: null },
    { id: 'service', icon: Wrench, label: 'Service', badge: '117' },
    { id: 'settings', icon: Settings, label: 'Innstillinger', badge: null },
  ];

  const claims = [
    { id: 'ELE-2412-0023', customer: 'Norsk Catering AS', product: 'Oppvaskmaskin', status: 'in_progress', date: 'I dag' },
    { id: 'RAT-2412-0007', customer: 'Grand Hotel', product: 'Kombiovn Rational', status: 'pending', date: 'I går' },
    { id: 'MIE-2412-0012', customer: 'Kiwi Majorstuen', product: 'Kjøledisk', status: 'resolved', date: '23. des' },
  ];

  const statusColors = {
    'in_progress': 'bg-yellow-100 text-yellow-700',
    'pending': 'bg-orange-100 text-orange-700',
    'resolved': 'bg-green-100 text-green-700',
  };

  const statusLabels = {
    'in_progress': 'Pågår',
    'pending': 'Venter leverandør',
    'resolved': 'Løst',
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* View selector */}
      <div className="flex justify-center gap-2 mb-6">
        {['desktop', 'ipad', 'iphone'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === view
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {view === 'desktop' ? '💻 Desktop' : view === 'ipad' ? '📱 iPad' : '📱 iPhone'}
          </button>
        ))}
      </div>

      {/* Desktop View */}
      {activeView === 'desktop' && (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Browser bar */}
          <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white rounded px-3 py-1 text-sm text-gray-500 max-w-md">
                🔒 portal.myhrvoldgruppen.no/dashboard
              </div>
            </div>
          </div>

          <div className="flex h-[600px]">
            {/* Sidebar */}
            <div className="w-64 bg-teal-600 text-white flex flex-col">
              <div className="p-4 border-b border-teal-500">
                <h1 className="font-bold text-lg">Myhrvoldgruppen</h1>
                <p className="text-teal-200 text-xs">Service Portal</p>
              </div>
              <nav className="flex-1 p-3">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                      activePage === item.id
                        ? 'bg-teal-700 text-white'
                        : 'text-teal-100 hover:bg-teal-700/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                        item.id === 'claims' ? 'bg-orange-500 text-white' : 'text-teal-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              <div className="p-3 border-t border-teal-500">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-sm font-medium">CM</div>
                  <div>
                    <div className="text-sm font-medium">Christopher</div>
                    <div className="text-xs text-teal-300">Admin</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 bg-gray-50 overflow-auto">
              {/* Topbar */}
              <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Søk etter kunder, reklamasjoner..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button className="relative p-2 hover:bg-gray-100 rounded-full">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                  </button>
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">CM</div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">God morgen, Christopher! 👋</h1>
                  <p className="text-gray-600 mt-1">Her er oversikten for i dag</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-5 shadow-sm border">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Aktive reklamasjoner</p>
                        <p className="text-3xl font-bold mt-1">12</p>
                        <p className="text-sm text-red-500 mt-1">↓ 3 fra forrige uke</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Venter på leverandør</p>
                        <p className="text-3xl font-bold mt-1">5</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Løst denne måneden</p>
                        <p className="text-3xl font-bold mt-1">8</p>
                        <p className="text-sm text-green-500 mt-1">↑ 25% fra forrige</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold">Siste reklamasjoner</h2>
                    <button className="text-teal-600 text-sm font-medium hover:underline">Se alle →</button>
                  </div>
                  <div className="divide-y">
                    {claims.map((claim) => (
                      <div key={claim.id} className="p-4 flex items-center hover:bg-gray-50 cursor-pointer">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{claim.id}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${statusColors[claim.status]}`}>
                              {statusLabels[claim.status]}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{claim.customer} - {claim.product}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{claim.date}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iPhone View */}
      {activeView === 'iphone' && (
        <div className="flex justify-center">
          <div className="w-[320px] h-[680px] bg-black rounded-[50px] p-3 shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-10"></div>
            <div className="w-full h-full bg-gray-50 rounded-[38px] overflow-hidden relative">
              {/* Header */}
              <div className="bg-teal-600 px-5 pt-14 pb-6">
                <p className="text-white/80 text-sm">God morgen,</p>
                <p className="text-white text-2xl font-bold">Christopher 👋</p>
              </div>

              {/* Stats */}
              <div className="px-4 -mt-4 relative z-10">
                <div className="bg-white rounded-xl p-4 shadow-lg flex justify-around">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">3</p>
                    <p className="text-xs text-gray-500">I dag</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">2</p>
                    <p className="text-xs text-gray-500">Ventende</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">8</p>
                    <p className="text-xs text-gray-500">Fullført</p>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 280px)' }}>
                <p className="font-semibold text-gray-800 mb-3">Mine oppdrag</p>
                <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs font-medium">Service</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">Haster</span>
                  </div>
                  <p className="font-medium">Norsk Catering AS</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <p className="text-sm text-gray-500">Storgata 15, Oslo</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <p className="text-sm text-gray-500">09:00 - 11:00</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Installasjon</span>
                  <p className="font-medium mt-2">Grand Hotel</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <p className="text-sm text-gray-500">Karl Johans gate 31</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <p className="text-sm text-gray-500">13:00 - 16:00</p>
                  </div>
                </div>
              </div>

              {/* Tab bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex justify-around rounded-b-[38px]">
                <button className="flex flex-col items-center">
                  <Home className="w-6 h-6 text-teal-600" />
                  <span className="text-xs text-teal-600 mt-1">Hjem</span>
                </button>
                <button className="flex flex-col items-center">
                  <ClipboardList className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Oppdrag</span>
                </button>
                <button className="flex flex-col items-center -mt-4">
                  <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </button>
                <button className="flex flex-col items-center">
                  <Bell className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Varsler</span>
                </button>
                <button className="flex flex-col items-center">
                  <User className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Profil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iPad View */}
      {activeView === 'ipad' && (
        <div className="flex justify-center">
          <div className="w-[700px] h-[500px] bg-black rounded-[30px] p-4 shadow-2xl">
            <div className="w-full h-full bg-gray-50 rounded-[20px] overflow-hidden flex">
              {/* Sidebar */}
              <div className="w-20 bg-teal-600 flex flex-col items-center py-4">
                <div className="w-12 h-12 bg-teal-500 rounded-xl mb-6 flex items-center justify-center text-white font-bold text-lg">M</div>
                <nav className="flex-1 flex flex-col items-center gap-2">
                  <button className="w-12 h-12 bg-teal-700 rounded-xl flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-12 h-12 hover:bg-teal-700/50 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-teal-200" />
                  </button>
                  <button className="w-12 h-12 hover:bg-teal-700/50 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-teal-200" />
                  </button>
                  <button className="w-12 h-12 hover:bg-teal-700/50 rounded-xl flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-teal-200" />
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium">CM</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Aktive</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Venter</p>
                    <p className="text-3xl font-bold text-orange-500">5</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Løst</p>
                    <p className="text-3xl font-bold text-green-500">8</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="font-semibold mb-4">Siste reklamasjoner</p>
                  <div className="space-y-3">
                    {claims.map((claim) => (
                      <div key={claim.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                        <span className="font-medium w-32">{claim.id}</span>
                        <span className="text-gray-600 flex-1">{claim.customer}</span>
                        <span className={`px-2 py-1 rounded text-xs ${statusColors[claim.status]}`}>
                          {statusLabels[claim.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status summary */}
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">✅ Alt er klart!</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-2xl">🗄️</p>
            <p className="font-medium text-green-800">Database</p>
            <p className="text-xs text-green-600">13 tabeller</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-2xl">📄</p>
            <p className="font-medium text-green-800">30 Faser</p>
            <p className="text-xs text-green-600">Dokumentert</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-2xl">🤖</p>
            <p className="font-medium text-green-800">Claude Code</p>
            <p className="text-xs text-green-600">Ready</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-2xl">🎨</p>
            <p className="font-medium text-green-800">Design</p>
            <p className="text-xs text-green-600">Nordic Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
}
