import React, { useState, useEffect } from 'react';

const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-sm border-l-4 ${color} bg-white`}>
    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default function DashboardHome() {
  const [stats, setStats] = useState({
    activeDisasters: 0,
    totalCamps: 0,
    volunteersActive: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []); // Fetches fresh data every time this tab is opened!

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
        <p className="text-gray-600 mt-1">Real-time status of your disaster response operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Disasters" value={stats.activeDisasters} color="border-red-500" />
        <StatCard title="Relief Camps" value={stats.totalCamps} color="border-blue-500" />
        <StatCard title="Active Volunteers" value={stats.volunteersActive} color="border-green-500" />
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h3 className="text-lg font-bold text-blue-800 mb-2">Welcome to DRCS</h3>
        <p className="text-blue-700">Use the sidebar to navigate between different management modules. Any data you add or delete will instantly reflect in these statistics when you return to this page.</p>
      </div>
    </div>
  );
}