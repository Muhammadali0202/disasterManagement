import React, { useState, useEffect } from 'react';

export default function InventoryTracker() {
  const [camps, setCamps] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState('');
  const [inventory, setInventory] = useState([]);
  
  const [formData, setFormData] = useState({ resource_id: '', quantity: '' });

  // Load Camps and Resources on boot
  useEffect(() => {
    fetch('http://localhost:5000/api/camps').then(res => res.json()).then(setCamps);
    fetch('http://localhost:5000/api/resources').then(res => res.json()).then(setResources);
  }, []);

  // Load Inventory whenever a new camp is selected
  useEffect(() => {
    if (selectedCamp) {
      fetch(`http://localhost:5000/api/inventory/${selectedCamp}`)
        .then(res => res.json())
        .then(setInventory);
    } else {
      setInventory([]);
    }
  }, [selectedCamp]);

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!selectedCamp) return alert("Please select a camp first!");

    await fetch('http://localhost:5000/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ camp_id: selectedCamp, ...formData })
    });

    // Refresh inventory list and clear form
    const updated = await fetch(`http://localhost:5000/api/inventory/${selectedCamp}`).then(r => r.json());
    setInventory(updated);
    setFormData({ resource_id: '', quantity: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Camp Inventory Logistics</h2>
      
      {/* Camp Selector */}
      <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <label className="block text-sm font-bold text-indigo-900 mb-2">Select Target Camp</label>
        <select 
          className="w-full p-2 border border-indigo-300 rounded focus:ring-indigo-500"
          value={selectedCamp} onChange={(e) => setSelectedCamp(e.target.value)}
        >
          <option value="">-- Choose a Camp to Manage --</option>
          {camps.map(camp => <option key={camp.camp_id} value={camp.camp_id}>{camp.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Add Stock Form */}
        <div className="md:col-span-1 border-r pr-6 border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Add Supplies</h3>
          <form onSubmit={handleAddStock} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Resource Type</label>
              <select required className="w-full mt-1 p-2 border rounded"
                value={formData.resource_id} onChange={e => setFormData({...formData, resource_id: e.target.value})}>
                <option value="">- Select Item -</option>
                {resources.map(r => <option key={r.resource_id} value={r.resource_id}>{r.name} ({r.unit})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Quantity to Add</label>
              <input type="number" required min="1" className="w-full mt-1 p-2 border rounded"
                value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
            </div>
            <button type="submit" disabled={!selectedCamp} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-gray-300 font-bold">
              Dispatch Supplies
            </button>
          </form>
        </div>

        {/* Right: Current Inventory Table */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Current Stock Levels</h3>
          {!selectedCamp ? (
             <p className="text-gray-400 italic">Select a camp to view its inventory.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.length === 0 ? (
                  <tr><td colSpan="3" className="px-6 py-4 text-gray-500 text-center">No supplies logged yet.</td></tr>
                ) : (
                  inventory.map((item, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">{item.quantity} <span className="text-gray-400 font-normal">{item.unit}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}