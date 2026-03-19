import React, { useState, useEffect } from 'react';
import VolunteerForm from './VolunteerForm';
import DisasterForm from './DisasterForm';
import CampManager from './CampManager';

// Reusable StatCard Component
const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-sm border-l-4 ${color} bg-white`}>
    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeDisasters: 0,
    totalCamps: 0,
    volunteersActive: 0,
  });

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.log("Waiting for backend server to start...");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">DRCS Command Center</h1>
        <p className="text-gray-600 mt-1">Real-time overview of disaster response operations.</p>
      </div>

      {/* Top Row: KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Active Disasters" value={stats.activeDisasters} color="border-red-500" />
        <StatCard title="Relief Camps" value={stats.totalCamps} color="border-blue-500" />
        <StatCard title="Active Volunteers" value={stats.volunteersActive} color="border-green-500" />
      </div>

      {/* Middle Row: Registration & Logging Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <VolunteerForm onAddSuccess={fetchStats} />
        <DisasterForm onAddSuccess={fetchStats} />
      </div>

      {/* Bottom Row: The Camp Management Section */}
      <CampManager onUpdate={fetchStats} /> 
      
    </div>
  );
}