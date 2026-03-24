import React, { useState } from 'react';

export default function AuthPortal({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: 'Processing...', type: 'text-blue-600' });
    
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          onLoginSuccess(data.admin.username); // Tell App.jsx we are logged in!
        } else {
          setMessage({ text: 'Account created! You can now log in.', type: 'text-green-600' });
          setIsLogin(true); // Switch to login view
          setFormData({ username: '', password: '' }); // Clear form
        }
      } else {
        setMessage({ text: data.error, type: 'text-red-600' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Is the server running?', type: 'text-red-600' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-center">
          <h1 className="text-3xl font-black text-white tracking-wider">DRCS</h1>
          <p className="text-indigo-200 mt-2 text-sm font-medium uppercase tracking-widest">Command Center Access</p>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Admin Login' : 'Register Admin'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" name="username" required value={formData.username} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50" />
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 font-bold transition duration-200 shadow-md">
              {isLogin ? 'Access Portal' : 'Create Account'}
            </button>

            {/* Messages */}
            {message.text && <p className={`text-center text-sm font-semibold ${message.type}`}>{message.text}</p>}
          </form>

          {/* Toggle Switch */}
          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have admin access? " : "Already have an account? "}
              <button onClick={() => { setIsLogin(!isLogin); setMessage({text:'', type:''}); }} className="text-indigo-600 font-bold hover:underline">
                {isLogin ? 'Sign up here' : 'Log in here'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}