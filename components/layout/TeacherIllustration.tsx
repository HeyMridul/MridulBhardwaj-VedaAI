export function TeacherIllustration({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 280 220" className="mx-auto h-[168px] w-[220px] sm:h-[196px] sm:w-[256px]">
        <circle cx="210" cy="42" r="28" fill="#E85D3A" opacity="0.12" />
        <circle cx="42" cy="168" r="22" fill="#E85D3A" opacity="0.1" />
        <circle cx="236" cy="150" r="10" fill="#E85D3A" opacity="0.18" />
        <circle cx="58" cy="48" r="8" fill="#E85D3A" opacity="0.16" />
        <circle cx="140" cy="118" r="78" fill="#fff7f1" />
        <circle cx="140" cy="118" r="78" fill="none" stroke="#f3d5c6" strokeWidth="2" />
        <ellipse cx="140" cy="176" rx="46" ry="14" fill="#ead7c8" opacity="0.55" />
        <rect x="102" y="118" width="76" height="62" rx="28" fill="#2A2A2A" />
        <rect x="110" y="126" width="60" height="18" rx="9" fill="#F4E6D8" />
        <circle cx="140" cy="84" r="28" fill="#F4C9A8" />
        <path
          d="M112 86c4-22 18-32 28-32 14 0 26 12 28 30 2 16-6 22-16 20-8-1-10-10-12-18-2 8-5 16-14 18-12 2-18-6-14-18Z"
          fill="#3A2A24"
        />
        <path d="M122 92c6 6 14 8 22 6" stroke="#C47A5A" strokeWidth="1.4" fill="none" />
        <circle cx="130" cy="86" r="2.2" fill="#2A2A2A" />
        <circle cx="150" cy="86" r="2.2" fill="#2A2A2A" />
        <path d="M134 96c4 3 8 3 12 0" stroke="#C45C4A" strokeWidth="1.4" fill="none" />
        <rect x="86" y="138" width="36" height="28" rx="4" fill="#E85D3A" transform="rotate(-12 86 138)" />
        <rect x="92" y="142" width="28" height="20" rx="2" fill="#FFF8F2" transform="rotate(-12 92 142)" />
        <rect x="158" y="140" width="34" height="26" rx="4" fill="#2A2A2A" transform="rotate(10 158 140)" />
        <rect x="164" y="144" width="24" height="18" rx="2" fill="#F7E3C8" transform="rotate(10 164 144)" />
        <path d="M168 48c10-6 22-4 28 4" stroke="#E85D3A" strokeWidth="2" fill="none" />
        <path d="M54 120c-8 10-8 24 2 32" stroke="#E85D3A" strokeWidth="2" fill="none" opacity="0.7" />
      </svg>
    </div>
  );
}
