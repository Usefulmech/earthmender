import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 240 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Community Circle Icon */}
      <g transform="translate(5, 5)">
        <circle cx="25" cy="25" r="22" fill="#ECFDF5" />
        {/* Stylized Hands/Leaves in a circle */}
        <path d="M25 5C30 5 35 10 35 15" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
        <path d="M45 25C45 30 40 35 35 35" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <path d="M25 45C20 45 15 40 15 35" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
        <path d="M5 25C5 20 10 15 15 15" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
        
        {/* Central Mend Stitch */}
        <path d="M20 25L30 25M25 20L25 30" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
      </g>
      
      {/* Text Part */}
      <text
        x="65"
        y="38"
        fill="#111827"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 800,
          fontSize: '26px',
          letterSpacing: '-0.03em',
        }}
      >
        earth
        <tspan fill="#10B981">mender</tspan>
      </text>
      <text
        x="65"
        y="52"
        fill="#6B7280"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 500,
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}
      >
        Community Powered Cleanup
      </text>
    </svg>
  );
};
