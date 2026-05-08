export function LogoMark({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M7 22.5V11.25C7 7.52 10.13 4.5 14 4.5h4c3.87 0 7 3.02 7 6.75V22.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M10 22.5h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 15h.01M20 15h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 24.5v3M20 24.5v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
