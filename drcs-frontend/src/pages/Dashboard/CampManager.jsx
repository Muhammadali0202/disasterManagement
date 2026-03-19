import React, { useState, useEffect } from 'react';

export default function CampManager({ onUpdate }) {
  const [camps, setCamps] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({ name: '', capacity: '', location_id: '' });

  // Fetch both Camps and Locations
  const fetchData = () => {
    fetch('http://localhost:5000/api/camps')
      .then(res => res.json())
      .then(data => setCamps(data));
      
    fetch('http://localhost:5000/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Add a new camp
  const handleAddCamp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/camps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ name: '', capacity: '', location_id: '' });
        fetchData(); // Refresh the list
        if (onUpdate) onUpdate(); // Refresh dashboard stats
      }
    } catch (error) {
      console.error("Error adding camp");
    }
  };

  // Delete a camp
  const handleDeleteCamp = async (camp_id) => {
    if (!window.confirm("Are you sure? Volunteers at this camp will become unassigned.")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/camps/${camp_id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchData(); // Refresh the list
        if (onUpdate) onUpdate(); // Refresh dashboard stats
      }
    } catch (error) {
      console.error("Error deleting camp");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 col-span-1 lg:col-span-2 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Relief Camps</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Add Camp Form */}
        <div className="md:col-span-1 border-r pr-6 border-gray-100">
          <form onSubmit={handleAddCamp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Camp Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 p-2 border" placeholder="e.g., Central Park Tents" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity (People)</label>
              <input type="number" name="capacity" required min="1" value={formData.capacity} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 p-2 border" placeholder="e.g., 500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <select name="location_id" required value={formData.location_id} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 p-2 border">
                <option value="">-- Select Location --</option>
                {locations.map(loc => (
                  <option key={loc.location_id} value={loc.location_id}>{loc.city}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 font-medium">Add New Camp</button>
          </form>
        </div>

        {/* Right Side: Active Camps List */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Active Camps Directory</h3>
          <div className="space-y-3">
            {camps.map(camp => (
              <div key={camp.camp_id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-800">{camp.name}</h4>
                  <p className="text-sm text-gray-500">Location: {camp.city || 'Unknown'} | Capacity: {camp.capacity}</p>
                </div>
                <button 
                  onClick={() => handleDeleteCamp(camp.camp_id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm font-medium transition"
                >
                  Delete
                </button>
              </div>
            ))}
            {camps.length === 0 && <p className="text-gray-500 text-sm">No active camps found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}