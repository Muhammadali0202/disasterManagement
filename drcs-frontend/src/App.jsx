import React, { useState } from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import AuthPortal from './Auth/AuthPortal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setAdminName(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminName('');
  };

  return (
    <div>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} adminName={adminName} />
      ) : (
        <AuthPortal onLoginSuccess={handleLogin} />
      )}
    </div>
  );
}

export default App;