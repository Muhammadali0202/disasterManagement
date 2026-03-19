import React, { useState, useEffect } from 'react';

export default function VolunteerForm({ onAddSuccess }) {
  const [camps, setCamps] = useState([]);
  const [disasters, setDisasters] = useState([]); // State to hold the disaster list
  
  // Updated to include assigned_disaster_id
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    assigned_camp_id: '',
    assigned_disaster_id: '' 
  });
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // 1. Fetch Relief Camps
    fetch('http://localhost:5000/api/camps')
      .then(res => res.json())
      .then(data => setCamps(data))
      .catch(err => console.error("Could not load camps", err));

    // 2. Fetch Active Disasters
    fetch('http://localhost:5000/api/disasters')
      .then(res => res.json())
      .then(data => setDisasters(data))
      .catch(err => console.error("Could not load disasters", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Submitting...');

    try {
      const response = await fetch('http://localhost:5000/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatusMessage('Volunteer successfully registered!');
        // Clear the form after success
        setFormData({ name: '', phone: '', assigned_camp_id: '', assigned_disaster_id: '' }); 
        if (onAddSuccess) onAddSuccess(); // Tell dashboard to update numbers
      } else {
        setStatusMessage('Error registering volunteer. Phone might already exist.');
      }
    } catch (error) {
      setStatusMessage('Network error. Is the server running?');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Register New Volunteer</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" name="name" required
            value={formData.name} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            placeholder="e.g., Muhammad Ali"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input 
            type="text" name="phone" required
            value={formData.phone} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            placeholder="0300-1234567"
          />
        </div>

        {/* Camp Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Assign to Camp</label>
          <select 
            name="assigned_camp_id" required
            value={formData.assigned_camp_id} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="">-- Select a Camp --</option>
            {camps.map(camp => (
              <option key={camp.camp_id} value={camp.camp_id}>{camp.name}</option>
            ))}
          </select>
        </div>

        {/* NEW: Disaster Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Assign to Disaster (Optional)</label>
          <select 
            name="assigned_disaster_id"
            value={formData.assigned_disaster_id} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="">-- General Assignment --</option>
            {disasters.map(disaster => (
              <option key={disaster.disaster_id} value={disaster.disaster_id}>
                {disaster.type} ({disaster.severity})
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
        >
          Register Volunteer
        </button>

        {/* Success/Error Message */}
        {statusMessage && (
          <p className={`text-sm mt-2 font-medium ${statusMessage.includes('Error') || statusMessage.includes('Network') ? 'text-red-600' : 'text-green-600'}`}>
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}