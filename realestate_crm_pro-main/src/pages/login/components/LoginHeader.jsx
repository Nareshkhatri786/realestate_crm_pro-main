import React from 'react';


const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Company Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-foreground" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-text-primary font-heading">
          Welcome Back
        </h1>
        <p className="text-text-secondary">
          Sign in to your RealEstate CRM Pro account
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;