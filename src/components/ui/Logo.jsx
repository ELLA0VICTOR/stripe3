export function LogoMark({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M9 9h46v46H9V9Z"
        fill="currentColor"
        fillOpacity="0.055"
      />
      <path
        d="M9 9h18M37 9h18v18M55 37v18H37M27 55H9V37M9 27V9"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="square"
      />
      <path
        d="M22 24.5c0-4.4 3.5-7.5 9.3-7.5h9.2M22 24.5c0 4 3.2 6.2 8.6 6.2h4.5c4.6 0 7.4 2 7.4 6.1 0 4.6-3.7 7.2-9.5 7.2H22.5"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M42.5 17h-9M42.5 31h-7.4M42.5 44H33"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        opacity="0.55"
      />
      <path d="M17 17h4v4h-4V17ZM43 43h4v4h-4v-4Z" fill="currentColor" />
    </svg>
  );
}
