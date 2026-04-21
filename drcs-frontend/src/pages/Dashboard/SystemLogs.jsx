import React, { useState, useEffect } from 'react';

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetching from your live Aiven database via the Render backend
    fetch('https://disastermanagement-jlc5.onrender.com/api/logs')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch logs');
        return res.json();
      })
      .then(data => {
        setLogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Audit Log Error:", err);
        setError('Could not connect to the audit database.');
        setIsLoading(false);
      });
  }, []);

  // Helper function to format the SQL timestamp into something readable
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Unknown Time';
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-8 border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            System Audit Logs
          </h2>
          <p className="text-gray-500 mt-1">Viewing the 50 most recent administrative actions.</p>
        </div>
        <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-md text-sm font-bold border border-red-100">
          Security Clearance Level: Admin
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium text-center">
          {error}
        </div>
      ) : isLoading ? (
        <div className="p-12 text-center text-gray-400 font-bold animate-pulse">
          Decrypting system logs...
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Action Event</th>
                {/* We map the columns generically in case your DB names vary slightly */}
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider hidden md:table-cell">Details / User ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500 italic">No system events have been logged yet.</td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={log.log_id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">
                      {formatDateTime(log.action_time || log.created_at)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {log.action || log.event_type || 'System Action'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                      {log.details || log.description || (log.user_id ? `User ID: ${log.user_id}` : 'N/A')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}