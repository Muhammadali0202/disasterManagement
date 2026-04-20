import React, { useState } from 'react';

export default function Dashboard() {
  // 1. Create a state to track if the sidebar is open or closed
  // Set to true by default so it shows up when they first log in
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* --- SIDEBAR ---
        The 'transition-transform' makes it slide smoothly.
        '-translate-x-full' hides it off the left side of the screen.
      */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-slate-900 w-64 z-30 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-black text-white tracking-wider">DRCS</h1>
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-1">Command Center</p>
        </div>

        <nav className="mt-6 text-gray-300">
          <div className="bg-indigo-600 text-white px-6 py-3 font-semibold">
            Dashboard Overview
          </div>
          
          <div className="px-6 py-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Operations</p>
            <ul className="space-y-4 font-medium">
              <li className="hover:text-white cursor-pointer transition-colors">Log Disaster</li>
              <li className="hover:text-white cursor-pointer transition-colors">Manage Camps</li>
              <li className="hover:text-white cursor-pointer transition-colors">Logistics & Inventory</li>
              <li className="hover:text-white cursor-pointer transition-colors">Volunteer Registry</li>
            </ul>
          </div>

          <div className="px-6 py-4">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">Security & Admin</p>
            <ul className="space-y-4 font-medium">
              <li className="hover:text-white cursor-pointer transition-colors">Audit Logs</li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA ---
        This area shrinks and expands depending on if the sidebar is open.
        The 'ml-64' pushes it over to make room for the sidebar.
      */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 shrink-0">
          
          {/* 2. The Toggle Button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-4 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle Sidebar"
          >
            {/* Hamburger Icon SVG */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
        </header>

        {/* Dashboard Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-8">
          
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-800">System Overview</h3>
            <p className="text-gray-500 mt-2">Real-time status of your disaster response operations.</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-6">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Active Disasters</p>
              <p className="text-4xl font-black text-slate-800">0</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Relief Camps</p>
              <p className="text-4xl font-black text-slate-800">0</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-6">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Active Volunteers</p>
              <p className="text-4xl font-black text-slate-800">0</p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-6">
            <h4 className="text-lg font-bold text-blue-900 mb-2">Welcome to DRCS</h4>
            <p className="text-blue-800">Use the sidebar to navigate between different management modules. Any data you add or delete will instantly reflect in these statistics when you return to this page.</p>
          </div>

        </main>
      </div>
      
    </div>
  );
}