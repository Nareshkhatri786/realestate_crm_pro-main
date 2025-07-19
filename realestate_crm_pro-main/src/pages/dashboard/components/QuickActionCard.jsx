import React from 'react';

import Button from '../../../components/ui/Button';

const QuickActionCard = ({ title, description, actions, className = '' }) => {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            iconName={action.icon}
            iconPosition="left"
            onClick={action.onClick}
            fullWidth
            className="justify-start"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCard;