export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <g transform="translate(5, 5)">
        <circle cx="25" cy="25" r="22" fill="#fafafa" stroke="#eaeaea" strokeWidth="1" />
        <path
          d="M25 5C30 5 35 10 35 15"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M45 25C45 30 40 35 35 35"
          stroke="#000000"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M25 45C20 45 15 40 15 35"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M5 25C5 20 10 15 15 15"
          stroke="#000000"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M20 25L30 25M25 20L25 30"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
