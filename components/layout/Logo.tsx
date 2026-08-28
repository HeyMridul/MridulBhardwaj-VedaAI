export function VedaLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="shrink-0 rounded-[10px]"
    >
      <rect width="36" height="36" rx="10" fill="#2A2A2A" />
      <path
        d="M10 8.5h6.4L18 22.2 19.6 8.5H26L20.6 27.5h-5.2L10 8.5Z"
        fill="#FBF7F2"
      />
    </svg>
  );
}
