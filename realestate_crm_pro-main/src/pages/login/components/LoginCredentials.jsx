import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoginCredentials = () => {
  const [isVisible, setIsVisible] = useState(false);

  const credentials = [
    {
      role: 'Admin',
      email: 'admin@realestate.com',
      password: 'admin123',
      description: 'Full system access with cross-project oversight'
    },
    {
      role: 'Project Manager',
      email: 'manager@realestate.com',
      password: 'manager123',
      description: 'Multi-project overview and team supervision'
    },
    {
      role: 'Sales Executive',
      email: 'sales@realestate.com',
      password: 'sales123',
      description: 'Post-visit opportunities and negotiations'
    },
    {
      role: 'Telecaller',
      email: 'telecaller@realestate.com',
      password: 'telecaller123',
      description: 'Lead qualification and site visit scheduling'
    }
  ];

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!isVisible) {
    return (
      <div className="mt-8 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVisibility}
          iconName="Eye"
          iconPosition="left"
          className="text-text-secondary hover:text-text-primary"
        >
          Show Demo Credentials
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 p-4 bg-background-secondary rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Demo Credentials</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVisibility}
          iconName="EyeOff"
          className="text-text-secondary hover:text-text-primary"
        />
      </div>
      
      <div className="space-y-3">
        {credentials.map((cred, index) => (
          <div key={index} className="p-3 bg-surface rounded-md border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">{cred.role}</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => copyToClipboard(cred.email)}
                  className="p-1 text-text-secondary hover:text-text-primary transition-colors duration-200"
                  title="Copy email"
                >
                  <Icon name="Copy" size={12} />
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary font-mono bg-background-secondary px-2 py-1 rounded">
                {cred.email}
              </p>
              <p className="text-xs text-text-secondary font-mono bg-background-secondary px-2 py-1 rounded">
                {cred.password}
              </p>
              <p className="text-xs text-text-muted mt-1">{cred.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 p-2 bg-warning-50 border border-warning-200 rounded-md">
        <p className="text-xs text-warning-700 flex items-center space-x-1">
          <Icon name="Info" size={12} />
          <span>These are demo credentials for testing purposes only</span>
        </p>
      </div>
    </div>
  );
};

export default LoginCredentials;