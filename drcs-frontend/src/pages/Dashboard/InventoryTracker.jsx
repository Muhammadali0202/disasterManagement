import React, { useState, useEffect } from 'react';

export default function InventoryTracker() {
  const [camps, setCamps] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState('');
  const [inventory, setInventory] = useState([]);
  
  const [formData, setFormData] = useState({ resource_id: '', quantity: '' });
  
  // UX States
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Load Camps and Resources on boot ---
  useEffect(() => {
    // FIXED: Updated slc5 to jlc5
    fetch('https://disastermanagement-jlc5.onrender.com/api/camps')
      .then(res => res.json())
      .then(setCamps)
      .catch(err => console.error("Failed to fetch camps:", err));
      
    // FIXED: Updated slc5 to jlc5
    fetch('https://disastermanagement-jlc5.onrender.com/api/resources')
      .then(res => res.json())
      .then(setResources)
      .catch(err => console.error("Failed to fetch resources:", err));
  }, []);

  // --- Load Inventory whenever a new camp is selected ---
  useEffect(() => {
    if (selectedCamp) {
      // FIXED: Updated slc5 to jlc5
      fetch(`https://disastermanagement-jlc5.onrender.com/api/inventory/${selectedCamp}`)
        .then(res => res.json())
        .then(setInventory)
        .catch(err => console.error("Failed to fetch inventory:", err));
    } else {
      setInventory([]);
      setMessage({ text: '', type: '' }); // Clear messages when camp changes
    }
  }, [selectedCamp]);

  const handleAddStock = async (e) => {
    e.preventDefault();
    
    // Smooth inline error instead of a jarring window alert
    if (!selectedCamp) {
      setMessage({ text: 'Please select a Target Camp from the dropdown first.', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: 'Dispatching supplies...', type: 'text-blue-700 bg-blue-50 border-l-4 border-blue-500' });

    try {
      // FIXED: Updated slc5 to jlc5
      const response = await fetch('https://disastermanagement-jlc5.onrender.com/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camp_id: selectedCamp, ...formData })
      });

      if (response.ok) {
        // Refresh inventory list to show the new item immediately
        const updated = await fetch(`https://disastermanagement-jlc5.onrender.com/api/inventory/${selectedCamp}`).then(r => r.json());
        setInventory(updated);
        
        // Reset form and show success
        setFormData({ resource_id: '', quantity: '' });
        setMessage({ text: 'Supplies successfully dispatched and logged!', type: 'text-green-700 bg-green-50 border-l-4 border-green-500' });
        
        // Hide success message after 3 seconds
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: 'Failed to dispatch supplies. Verify data.', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Is the backend server running?', type: 'text-red-700 bg-red-50 border-l-4 border-red-500' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Camp Inventory Logistics</h2>
        <p className="text-gray-500 mt-1">Manage and dispatch critical supplies to active relief zones.</p>
      </div>
      
      {/* Camp Selector */}
      <div className="mb-8 p-6 bg-indigo-50/50 rounded-lg border border-indigo-100">
        <label className="block text-sm font-bold text-indigo-900 mb-2">Select Target Camp</label>
        <select 
          className="w-full p-3 border border-indigo-200 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          value={selectedCamp} onChange={(e) => setSelectedCamp(e.target.value)}
        >
          <option value="">-- Choose an Active Camp to Manage --</option>
          {camps.map(camp => <option key={camp.camp_id} value={camp.camp_id}>{camp.name}</option>)}
        </select>
      </div>

      {/* Dynamic Messages */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md font-medium text-sm ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Add Stock Form */}
        <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Add Supplies</h3>
          <form onSubmit={handleAddStock} className="space-y-5 bg-gray-50 p-5 rounded-lg border border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Resource Type</label>
              <select required className="w-full mt-1 p-2.5 border border-gray-300 shadow-sm rounded-md focus:ring-indigo-500"
                value={formData.resource_id} onChange={e => setFormData({...formData, resource_id: e.target.value})}>
                <option value="">- Select Item -</option>
                {resources.map(r => <option key={r.resource_id} value={r.resource_id}>{r.name} ({r.unit})</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700">Quantity to Add</label>
              <input type="number" required min="1" className="w-full mt-1 p-2.5 border border-gray-300 shadow-sm rounded-md focus:ring-indigo-500"
                value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="e.g. 50" />
            </div>
            
            <button type="submit" disabled={!selectedCamp || isSubmitting} 
              className={`w-full text-white p-3 rounded-md font-bold transition-colors shadow-sm
                ${(!selectedCamp || isSubmitting) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
              {isSubmitting ? 'Dispatching...' : 'Dispatch Supplies'}
            </button>
          </form>
        </div>

        {/* Right: Current Inventory Table */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Current Stock Levels</h3>
          
          {!selectedCamp ? (
             <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
               <p className="text-gray-400 font-medium">Select a camp above to view its inventory.</p>
             </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Item</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-8 text-gray-500 text-center font-medium italic">No supplies have been dispatched to this camp yet.</td></tr>
                  ) : (
                    inventory.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-black text-green-600">
                          {item.quantity} <span className="text-gray-400 font-medium text-xs ml-1">{item.unit}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}