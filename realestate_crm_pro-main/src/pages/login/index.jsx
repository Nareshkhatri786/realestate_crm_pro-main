import React from 'react';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginCredentials from './components/LoginCredentials';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Login Container */}
      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-surface border border-border rounded-xl shadow-xl p-8">
          <LoginHeader />
          <LoginForm />
          <LoginCredentials />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} RealEstate CRM Pro. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary-100 rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-secondary-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default Login;