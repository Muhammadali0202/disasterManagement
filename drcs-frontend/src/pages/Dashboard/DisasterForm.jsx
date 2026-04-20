import React, { useState, useEffect } from 'react';

export default function DisasterForm({ onAddSuccess }) {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({ type: '', date_occurred: '', severity: 'Moderate', location_id: '' });
  
  // Upgraded message state to handle colors based on success/error
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch Locations on Load ---
  useEffect(() => {
    // FIXED: Updated slc5 to jlc5 to match your live server!
    fetch('https://disastermanagement-jlc5.onrender.com/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error("Failed to fetch locations:", err));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: 'Broadcasting alert to database...', type: 'text-blue-600 bg-blue-50' });

    try {
      // FIXED: Updated slc5 to jlc5
      const response = await fetch('https://disastermanagement-jlc5.onrender.com/api/disasters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ text: 'Incident successfully logged into the system!', type: 'text-green-700 bg-green-50 border-l-4 border-green-500' });
        setFormData({ type: '', date_occurred: '', severity: 'Moderate', location_id: '' });
        
        if (onAddSuccess) onAddSuccess();
        
        // Auto-hide the success message after 4 seconds
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      } else {
        setMessage({ text: 'Error logging disaster. Please verify your data.', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Is the backend server running?', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
    } finally {
      setIsSubmitting(false); // Turn the button back on
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h3 className="text-2xl font-bold text-slate-800">Log New Disaster Incident</h3>
        <p className="text-gray-500 mt-1">Enter the details below to alert the command center.</p>
      </div>

      {/* Dynamic Alert Messages */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md font-medium ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Disaster Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Disaster Type</label>
            <input type="text" name="type" required value={formData.type} onChange={handleChange} 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50" 
              placeholder="e.g., Urban Flooding" />
          </div>

          {/* Date Occurred */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date Occurred</label>
            <input type="date" name="date_occurred" required value={formData.date_occurred} onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50" />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Severity Level</label>
            <select name="severity" value={formData.severity} onChange={handleChange} 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50">
              <option value="Minor">Minor</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
              <option value="Catastrophic">Catastrophic</option>
            </select>
          </div>

          {/* Location Dropdown (Fed from Database) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
            <select name="location_id" required value={formData.location_id} onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50">
              <option value="">-- Select Valid Database Location --</option>
              {locations.map(loc => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.city} ({loc.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isSubmitting} 
            className={`px-6 py-3 rounded-md font-bold text-white shadow-md transition-all ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {isSubmitting ? 'Saving to Database...' : 'Log Incident'}
          </button>
        </div>
      </form>
    </div>
  );
}