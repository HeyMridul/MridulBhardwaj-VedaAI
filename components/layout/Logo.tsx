export function VedaLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="shrink-0 rounded-[10px] shadow-sm"
    >
      <rect width="36" height="36" rx="10" fill="#2A2A2A" />
      <path
        d="M9.5 9.5h6.2L18 21.2 20.3 9.5h6.2L21.2 26.5h-6.4L9.5 9.5Z"
        fill="#FBF7F2"
      />
      <path d="M24.8 8.4 27 10.1l-1.4 2.2-2.1-1.6 1.3-2.3Z" fill="#E85D3A" />
    </svg>
  );
}
