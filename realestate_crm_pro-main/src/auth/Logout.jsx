import React from 'react';
import { useAuth } from './AuthContext';

const Logout = ({ children, className = '', ...props }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // TODO: Add any cleanup logic in future PRs (e.g., clear cached data)
  };

  // If children are provided, render as a wrapper component
  if (children) {
    return (
      <div onClick={handleLogout} className={className} {...props}>
        {children}
      </div>
    );
  }

  // Default logout button
  return (
    <button
      onClick={handleLogout}
      className={`text-red-600 hover:text-red-700 font-medium ${className}`}
      {...props}
    >
      Logout
    </button>
  );
};

export default Logout;