import React, { useState } from 'react';
import DashboardHome from './DashboardHome';
import VolunteerForm from './VolunteerForm';
import DisasterForm from './DisasterForm';
import CampManager from './CampManager';

export default function Dashboard({ onLogout, adminName }) {
  // This state controls which page is currently visible!
  const [activeTab, setActiveTab] = useState('home');

  // A helper function to render the correct component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <DashboardHome />;
      case 'disasters': return <DisasterForm />;
      case 'camps': return <CampManager />;
      case 'volunteers': return <VolunteerForm />;
      default: return <DashboardHome />;
    }
  };

  // Helper for Sidebar Button Styling
  const navItemClass = (tabName) => `
    w-full text-left px-6 py-3 font-medium transition-colors duration-200
    ${activeTab === tabName 
      ? 'bg-indigo-600 text-white border-l-4 border-white' 
      : 'text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'}
  `;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. THE SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 bg-gray-950">
          <h1 className="text-2xl font-black tracking-wider text-white">DRCS</h1>
          <p className="text-xs text-indigo-400 uppercase tracking-widest mt-1 font-semibold">Command Center</p>
        </div>

        <nav className="flex-1 mt-6 space-y-2">
          <button onClick={() => setActiveTab('home')} className={navItemClass('home')}>
            📊 Dashboard Overview
          </button>
          
          <div className="px-6 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Operations
          </div>
          
          <button onClick={() => setActiveTab('disasters')} className={navItemClass('disasters')}>
            🚨 Log Disaster
          </button>
          <button onClick={() => setActiveTab('camps')} className={navItemClass('camps')}>
            ⛺ Manage Camps
          </button>
          <button onClick={() => setActiveTab('volunteers')} className={navItemClass('volunteers')}>
            🙋 Volunteer Registry
          </button>
        </nav>

        <div className="p-6 bg-gray-950 text-sm text-gray-400 border-t border-gray-800">
          <p className="mb-3">Logged in as: <span className="font-bold text-white">{adminName}</span></p>
          <button 
            onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors font-medium text-xs uppercase tracking-wider"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* 2. THE MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Navbar Area (Optional, just for aesthetics) */}
        <header className="bg-white shadow-sm h-16 flex items-center px-8">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab === 'home' ? 'Overview' : activeTab}
          </h2>
        </header>

        {/* The actual injected page content */}
        <main className="p-8 max-w-6xl mx-auto">
          {renderContent()}
        </main>
      </div>

    </div>
  );
}