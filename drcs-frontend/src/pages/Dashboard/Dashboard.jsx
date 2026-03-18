import React from 'react';

const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-sm border-l-4 ${color} bg-white`}>
    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default function Dashboard() {
  // In reality, these would be fetched from your PostgreSQL database via Express
  const stats = {
    activeDisasters: 3,
    totalCamps: 12,
    volunteersActive: 145,
    criticalResources: 5
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">DRCS Command Center</h1>
        <p className="text-gray-600 mt-1">Real-time overview of disaster response operations.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Disasters" value={stats.activeDisasters} color="border-red-500" />
        <StatCard title="Relief Camps" value={stats.totalCamps} color="border-blue-500" />
        <StatCard title="Active Volunteers" value={stats.volunteersActive} color="border-green-500" />
        <StatCard title="Low Inventory Alerts" value={stats.criticalResources} color="border-yellow-500" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Resource Distributions</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3 font-medium">Item</th>
                <th className="p-3 font-medium">Camp</th>
                <th className="p-3 font-medium">Quantity</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">Medical Kits</td>
                <td className="p-3">Camp Alpha</td>
                <td className="p-3">250</td>
                <td className="p-3"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Delivered</span></td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Bottled Water</td>
                <td className="p-3">Camp Beta</td>
                <td className="p-3">1000</td>
                <td className="p-3"><span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">In Transit</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Priority Actions</h2>
          <ul className="space-y-4">
            <li className="flex items-center text-red-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-600 mr-3"></span>
              Restock Medicine at Camp Delta
            </li>
            <li className="flex items-center text-yellow-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-yellow-600 mr-3"></span>
              Assign 5 Volunteers to Camp Alpha
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}