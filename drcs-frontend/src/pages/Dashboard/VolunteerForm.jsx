import React, { useState, useEffect } from 'react';

export default function VolunteerForm({ onAddSuccess }) {
  const [camps, setCamps] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', assigned_camp_id: '' });
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch the list of camps for the dropdown menu
  useEffect(() => {
    fetch('http://localhost:5000/api/camps')
      .then(res => res.json())
      .then(data => setCamps(data))
      .catch(err => console.error("Could not load camps", err));
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
        setFormData({ name: '', phone: '', assigned_camp_id: '' }); // Clear form
        if (onAddSuccess) onAddSuccess(); // Tell dashboard to update stats
      } else {
        setStatusMessage('Error registering volunteer.');
      }
    } catch (error) {
      setStatusMessage('Network error. Is the server running?');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Register New Volunteer</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" name="name" required
            value={formData.name} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            placeholder="Ali Khan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input 
            type="text" name="phone" required
            value={formData.phone} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            placeholder="0300-1234567"
          />
        </div>

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

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
        >
          Register Volunteer
        </button>

        {statusMessage && (
          <p className={`text-sm mt-2 font-medium ${statusMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}