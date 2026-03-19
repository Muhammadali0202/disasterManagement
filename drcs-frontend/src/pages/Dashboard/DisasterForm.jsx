import React, { useState, useEffect } from 'react';

export default function DisasterForm({ onAddSuccess }) {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({ type: '', date_occurred: '', severity: 'Moderate', location_id: '' });
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Logging disaster...');
    try {
      const response = await fetch('http://localhost:5000/api/disasters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatusMessage('Disaster successfully logged!');
        setFormData({ type: '', date_occurred: '', severity: 'Moderate', location_id: '' });
        if (onAddSuccess) onAddSuccess();
      } else {
        setStatusMessage('Error logging disaster.');
      }
    } catch (error) {
      setStatusMessage('Network error.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-red-600 mb-4">Log New Disaster</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Disaster Type</label>
          <input type="text" name="type" required value={formData.type} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 p-2 border" placeholder="e.g., Earthquake" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date Occurred</label>
          <input type="date" name="date_occurred" required value={formData.date_occurred} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Severity</label>
          <select name="severity" value={formData.severity} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 p-2 border">
            <option value="Minor">Minor</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
            <option value="Catastrophic">Catastrophic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <select name="location_id" required value={formData.location_id} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 p-2 border">
            <option value="">-- Select Location --</option>
            {locations.map(loc => (
              <option key={loc.location_id} value={loc.location_id}>{loc.city} ({loc.district})</option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 font-medium">Log Disaster</button>
        {statusMessage && <p className="text-sm mt-2 font-medium text-green-600">{statusMessage}</p>}
      </form>
    </div>
  );
}