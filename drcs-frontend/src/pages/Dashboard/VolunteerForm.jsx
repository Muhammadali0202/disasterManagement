import React, { useState, useEffect } from 'react';

export default function VolunteerForm() {
  const [volunteers, setVolunteers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', skills: 'General Help', camp_id: '' });

  // UX States
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch Data on Load ---
  const fetchData = () => {
    // Fetch active volunteers
    fetch('https://disastermanagement-jlc5.onrender.com/api/volunteers')
      .then(res => res.ok ? res.json() : [])
      .then(data => setVolunteers(data))
      .catch(err => console.error("Failed to fetch volunteers:", err));

    // Fetch camps for assignment dropdown
    fetch('https://disastermanagement-jlc5.onrender.com/api/camps')
      .then(res => res.ok ? res.json() : [])
      .then(data => setCamps(data))
      .catch(err => console.error("Failed to fetch camps:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Register New Volunteer ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: 'Registering volunteer...', type: 'text-blue-700 bg-blue-50 border-l-4 border-blue-500' });

    try {
      const response = await fetch('https://disastermanagement-jlc5.onrender.com/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({ name: '', phone: '', skills: 'General Help', camp_id: '' });
        fetchData(); // Refresh the list
        setMessage({ text: 'Volunteer successfully registered and deployed!', type: 'text-green-700 bg-green-50 border-l-4 border-green-500' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: 'Registration failed. Verify data.', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Is the backend server running?', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Remove Volunteer ---
  const handleRemove = async (volunteer_id) => {
    if (!window.confirm("Are you sure you want to remove this volunteer from active duty?")) return;
    
    try {
      const response = await fetch(`https://disastermanagement-jlc5.onrender.com/api/volunteers/${volunteer_id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchData(); // Refresh the list
        setMessage({ text: 'Volunteer removed from active roster.', type: 'text-green-700 bg-green-50 border-l-4 border-green-500' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (error) {
      setMessage({ text: 'Network error during removal.', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 col-span-1 lg:col-span-2">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Volunteer Registry</h2>
        <p className="text-gray-500 mt-1">Register incoming personnel and assign them to active relief camps.</p>
      </div>
      
      {/* Dynamic Messages */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md font-medium text-sm ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Registration Form */}
        <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-6">
          <form onSubmit={handleRegister} className="space-y-5 bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">New Recruit</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white" 
                placeholder="e.g., Jane Doe" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white" 
                placeholder="0300-1234567" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Specialty / Skills</label>
              <select name="skills" required value={formData.skills} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white">
                <option value="General Help">General Help</option>
                <option value="Medical">Medical / First Aid</option>
                <option value="Logistics">Logistics / Driving</option>
                <option value="Rescue">Search & Rescue</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700">Assign to Camp</label>
              <select name="camp_id" value={formData.camp_id} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white">
                <option value="">-- Unassigned (Standby) --</option>
                {camps.map(camp => (
                  <option key={camp.camp_id} value={camp.camp_id}>{camp.name}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" disabled={isSubmitting} 
              className={`w-full text-white py-3 px-4 rounded-md font-bold shadow-sm transition-all
                ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isSubmitting ? 'Registering...' : 'Deploy Personnel'}
            </button>
          </form>
        </div>

        {/* Right Side: Active Personnel List */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Active Roster</h3>
          
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Volunteer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Skillset</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Assignment</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {volunteers.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-8 text-gray-500 text-center font-medium italic">No active volunteers on the roster.</td></tr>
                ) : (
                  volunteers.map((vol) => (
                    <tr key={vol.volunteer_id || vol.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{vol.name}</div>
                        <div className="text-sm text-gray-500">{vol.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {vol.skills}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {/* Display camp name if joined with DB, otherwise just show ID or fallback */}
                        {vol.camp_name || (vol.camp_id ? `Camp ID: ${vol.camp_id}` : 'Standby')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleRemove(vol.volunteer_id || vol.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-bold bg-red-50 px-3 py-1 rounded border border-red-100 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}