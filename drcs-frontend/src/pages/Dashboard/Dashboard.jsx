import React, { useState } from 'react';

// 1. Import your pages from the same folder!
import DisasterForm from './DisasterForm'; 
import CampManager from './CampManager';
import InventoryTracker from './InventoryTracker';
import VolunteerForm from './VolunteerForm';
import SystemLogs from './SystemLogs';

export default function Dashboard({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  // 2. Decide what to show based on the active view
  const renderContent = () => {
    switch(activeView) {
      case 'overview':
        return <SystemOverviewContent />;
      case 'log_disaster':
        return <DisasterForm />;
      case 'manage_camps':
        return <CampManager />;
      case 'inventory':
        return <InventoryTracker />;
      case 'volunteers':
        return <VolunteerForm />;
      case 'audit_logs':
        return <SystemLogs />;
      default:
        return <SystemOverviewContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 w-64 z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-black text-white tracking-wider">DRCS</h1>
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-1">Command Center</p>
        </div>

        <nav className="mt-6 text-gray-300">
          <div 
            onClick={() => setActiveView('overview')}
            className={`px-6 py-3 font-semibold cursor-pointer transition-colors ${activeView === 'overview' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            Dashboard Overview
          </div>
          
          <div className="px-6 py-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Operations</p>
            <ul className="space-y-4 font-medium">
              <li 
                onClick={() => setActiveView('log_disaster')}
                className={`cursor-pointer transition-colors ${activeView === 'log_disaster' ? 'text-indigo-400' : 'hover:text-white'}`}
              >
                Log Disaster
              </li>
              <li 
                onClick={() => setActiveView('manage_camps')}
                className={`cursor-pointer transition-colors ${activeView === 'manage_camps' ? 'text-indigo-400' : 'hover:text-white'}`}
              >
                Manage Camps
              </li>
              <li 
                onClick={() => setActiveView('inventory')}
                className={`cursor-pointer transition-colors ${activeView === 'inventory' ? 'text-indigo-400' : 'hover:text-white'}`}
              >
                Logistics & Inventory
              </li>
              <li 
                onClick={() => setActiveView('volunteers')}
                className={`cursor-pointer transition-colors ${activeView === 'volunteers' ? 'text-indigo-400' : 'hover:text-white'}`}
              >
                Volunteer Registry
              </li>
            </ul>
          </div>
          <div className="px-6 py-4 border-t border-slate-800">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">Security & Admin</p>
            <ul className="space-y-4 font-medium">
              <li 
                onClick={() => setActiveView('audit_logs')}
                className={`cursor-pointer transition-colors ${activeView === 'audit_logs' ? 'text-red-400' : 'hover:text-white'}`}
              >
                Audit Logs
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-4 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {activeView === 'overview' && 'System Overview'}
              {activeView === 'log_disaster' && 'Log a New Disaster'}
              {activeView === 'manage_camps' && 'Camp Management'}
              {activeView === 'inventory' && 'Logistics Hub'}
            </h2>
          </div>
          
          {/* Logout Button */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Admin: <span className="font-bold text-indigo-600">{user}</span></span>
            <button onClick={onLogout} className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 font-semibold transition-colors">
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()} 
        </main>

      </div>
    </div>
  );
}
// --- OVERVIEW COMPONENT ---
function SystemOverviewContent() {
  // 1. Create a memory state to hold the live counts
  const [stats, setStats] = useState({ disasters: 0, camps: 0, volunteers: 0 });

  // 2. Fetch the data from your live database when the page loads
  React.useEffect(() => {
    // We use Promise.all to fetch all three databases at the exact same time
    Promise.all([
      fetch('https://disastermanagement-jlc5.onrender.com/api/disasters').then(res => res.ok ? res.json() : []),
      fetch('https://disastermanagement-jlc5.onrender.com/api/camps').then(res => res.ok ? res.json() : []),
      fetch('https://disastermanagement-jlc5.onrender.com/api/volunteers').then(res => res.ok ? res.json() : [])
    ])
    .then(([disastersData, campsData, volunteersData]) => {
      // Update the numbers based on how many items are in the database arrays
      setStats({
        disasters: disastersData.length || 0,
        camps: campsData.length || 0,
        volunteers: volunteersData.length || 0
      });
    })
    .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-6">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Active Disasters</p>
          {/* Replace hardcoded 0 with live data */}
          <p className="text-4xl font-black text-slate-800">{stats.disasters}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Relief Camps</p>
          {/* Replace hardcoded 0 with live data */}
          <p className="text-4xl font-black text-slate-800">{stats.camps}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-6">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Active Volunteers</p>
          {/* Replace hardcoded 0 with live data */}
          <p className="text-4xl font-black text-slate-800">{stats.volunteers}</p>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h4 className="text-lg font-bold text-blue-900 mb-2">Welcome to DRCS</h4>
        <p className="text-blue-800">Use the sidebar to navigate between different management modules. Your overview statistics are now synced live with your database.</p>
      </div>
    </>
  );
}