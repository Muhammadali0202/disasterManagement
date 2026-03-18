import React, { useState, useEffect } from 'react';
import VolunteerForm from './VolunteerForm';

// Reusable StatCard Component
const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-sm border-l-4 ${color} bg-white`}>
    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default function Dashboard() {
  // 1. STATE MUST GO FIRST
  const [stats, setStats] = useState({
    activeDisasters: 0,
    totalCamps: 0,
    volunteersActive: 0,
  });

  // 2. THE FETCH FUNCTION MUST GO SECOND
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

  // 3. USE-EFFECT GOES THIRD
  useEffect(() => {
    fetchStats();
  }, []);

  // 4. THE UI GOES LAST
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">DRCS Command Center</h1>
        <p className="text-gray-600 mt-1">Real-time overview of disaster response operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Active Disasters" value={stats.activeDisasters} color="border-red-500" />
        <StatCard title="Relief Camps" value={stats.totalCamps} color="border-blue-500" />
        <StatCard title="Active Volunteers" value={stats.volunteersActive} color="border-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your new form! */}
        <VolunteerForm onAddSuccess={fetchStats} />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Status</h2>
          <p className="text-gray-600">The React frontend is connected to your MySQL database.</p>
        </div>
      </div>
    </div>
  );
}