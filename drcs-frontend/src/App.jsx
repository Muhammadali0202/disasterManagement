import React, { useState, useEffect } from 'react';
import AuthPortal from './Auth/AuthPortal'; // Make sure this path is correct based on your file structure
// TODO: Import your Dashboard component here once it's ready!
import Dashboard from './pages/Dashboard'; 

function App() {
  // 1. State to track the logged-in user
  const [user, setUser] = useState(null);
  
  // 2. State to prevent the login screen from flashing on refresh
  const [isLoading, setIsLoading] = useState(true);

  // --- Check local storage the moment the app loads ---
  useEffect(() => {
    const savedUser = localStorage.getItem('drcs_user');
    
    if (savedUser) {
      // If a user is found in the browser's memory, log them in automatically
      setUser(savedUser); 
    }
    
    // We are done checking memory, turn off the loading screen
    setIsLoading(false); 
  }, []);

  // --- Logout Function ---
  const handleLogout = () => {
    localStorage.removeItem('drcs_user'); // Erase the browser memory
    setUser(null); // Boot them back to the login screen
  };

  // Show a simple loading screen while checking memory
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl font-bold tracking-widest animate-pulse">
          INITIALIZING DRCS...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* If a user is logged in, show the Dashboard. Otherwise, show AuthPortal. */}
      {user ? (
        
        // --- TEMPORARY DASHBOARD PLACEHOLDER ---
        // Replace this entire div with your actual <Dashboard /> component!
        <Dashboard user={user} onLogout={handleLogout} /> 
      ) : (
        <AuthPortal onLoginSuccess={(username) => setUser(username)} />
      )}
    </div>
  );
}

export default App;