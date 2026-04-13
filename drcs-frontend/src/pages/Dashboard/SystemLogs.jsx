import React, { useState, useEffect } from 'react';

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await fetch('https://disastermanagement-slc5.onrender.com/api/logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs when the component mounts
  useEffect(() => {
    fetchLogs();
  }, []);

  // Helper function to format the timestamp nicely
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">System Audit Logs</h2>
          <p className="text-sm text-gray-500 mt-1">Immutable record of critical database events triggered by system admins.</p>
        </div>
        <button onClick={fetchLogs} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded font-medium transition">
          Refresh Logs
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Target Table</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Record Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500 font-medium">Loading security logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500 font-medium">No destructive actions logged yet.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.log_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(log.action_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.action_type === 'DELETE' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.action_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {log.table_affected}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {log.record_details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}