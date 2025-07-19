import React from 'react';
import Icon from '../AppIcon';

const StarRating = ({ rating = 0, maxRating = 3, size = 16, className = '' }) => {
  const stars = [];
  
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <Icon
        key={i}
        name="Star"
        size={size}
        className={`${
          i <= rating 
            ? 'text-warning-500 fill-warning-500' :'text-secondary-300'
        } ${className}`}
      />
    );
  }
  
  return (
    <div className="flex items-center space-x-0.5">
      {stars}
    </div>
  );
};

export default StarRating;