import React, { useState, useEffect } from 'react';

export default function CampManager({ onUpdate }) {
  const [camps, setCamps] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({ name: '', capacity: '', location_id: '' });

  // UX States
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch both Camps and Locations ---
  const fetchData = () => {
    // FIXED: Updated slc5 to jlc5
    fetch('https://disastermanagement-jlc5.onrender.com/api/camps')
      .then(res => res.json())
      .then(data => setCamps(data))
      .catch(err => console.error("Failed to fetch camps:", err));
      
    // FIXED: Updated slc5 to jlc5
    fetch('https://disastermanagement-jlc5.onrender.com/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error("Failed to fetch locations:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Add a new camp ---
  const handleAddCamp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: 'Establishing camp in database...', type: 'text-blue-700 bg-blue-50 border-l-4 border-blue-500' });

    try {
      // FIXED: Updated slc5 to jlc5
      const response = await fetch('https://disastermanagement-jlc5.onrender.com/api/camps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({ name: '', capacity: '', location_id: '' });
        fetchData(); // Refresh the list
        if (onUpdate) onUpdate(); // Refresh dashboard stats
        
        setMessage({ text: 'Relief camp successfully established!', type: 'text-green-700 bg-green-50 border-l-4 border-green-500' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: 'Failed to create camp. Verify data.', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Is the backend server running?', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Delete a camp ---
  const handleDeleteCamp = async (camp_id) => {
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to delete this camp? Volunteers and inventory assigned to this camp will be unassigned.")) return;
    
    try {
      // FIXED: Updated slc5 to jlc5
      const response = await fetch(`https://disastermanagement-jlc5.onrender.com/api/camps/${camp_id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchData(); // Refresh the list
        if (onUpdate) onUpdate(); // Refresh dashboard stats
        setMessage({ text: 'Camp successfully decommissioned.', type: 'text-green-700 bg-green-50 border-l-4 border-green-500' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: 'Failed to delete camp.', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
      }
    } catch (error) {
      setMessage({ text: 'Network error during deletion.', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 col-span-1 lg:col-span-2">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Manage Relief Camps</h2>
        <p className="text-gray-500 mt-1">Establish new command centers or decommission inactive ones.</p>
      </div>
      
      {/* Dynamic Messages */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md font-medium text-sm ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Add Camp Form */}
        <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-6">
          <form onSubmit={handleAddCamp} className="space-y-5 bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Establish Base</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Camp Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white" 
                placeholder="e.g., Central Park Tents" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700">Maximum Capacity</label>
              <input type="number" name="capacity" required min="1" value={formData.capacity} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white" 
                placeholder="e.g., 500 people" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700">Operational Zone</label>
              <select name="location_id" required value={formData.location_id} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white">
                <option value="">-- Select Valid Location --</option>
                {locations.map(loc => (
                  <option key={loc.location_id} value={loc.location_id}>{loc.city}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" disabled={isSubmitting} 
              className={`w-full text-white py-3 px-4 rounded-md font-bold shadow-sm transition-all
                ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isSubmitting ? 'Establishing...' : 'Deploy Camp'}
            </button>
          </form>
        </div>

        {/* Right Side: Active Camps List */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Active Operations Directory</h3>
          
          <div className="space-y-3">
            {camps.map(camp => (
              <div key={camp.camp_id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors">
                <div className="mb-3 sm:mb-0">
                  <h4 className="font-bold text-lg text-slate-800">{camp.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 font-medium">
                    <span>📍 {camp.city || 'Unknown Location'}</span>
                    <span>👥 Capacity: {camp.capacity}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteCamp(camp.camp_id)}
                  className="w-full sm:w-auto bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 text-sm font-bold transition-colors border border-red-100"
                >
                  Decommission
                </button>
              </div>
            ))}
            
            {camps.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-400 font-medium italic">No active relief camps found in the database.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}