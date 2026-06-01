import React from 'react';

export const Emblem: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      
      {/* Outer Ring of Community */}
      <circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="1" />
      
      {/* Diverse "Hands" forming a circle */}
      <path d="M50 10C65 10 75 20 75 35" stroke="#10B981" strokeWidth="8" strokeLinecap="round" />
      <path d="M90 50C90 65 80 75 65 75" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
      <path d="M50 90C35 90 25 80 25 65" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
      <path d="M10 50C10 35 20 25 35 25" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />

      {/* Central Globe/Heart */}
      <path
        d="M50 35C50 35 65 40 65 55C65 70 50 80 50 80C50 80 35 70 35 55C35 40 50 35 50 35Z"
        fill="url(#grad1)"
      />
      
      {/* The "Mend" Stitch - now white for contrast */}
      <path
        d="M45 52L55 52M50 47L50 57"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};
