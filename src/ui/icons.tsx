interface IconProps {
  size?: number
  className?: string
}

const base = (size: number): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

export const PlayIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 4.5v15l13-7.5z" />
  </svg>
)
export const PlayAllIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.5 5v14l9.5-7z" opacity="0.4" />
    <path d="M11 5v14l9.5-7z" />
  </svg>
)
export const StopIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
)
export const PlusIcon = ({ size = 13 }: IconProps) => (
  <svg {...base(size)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
export const PlusCircleIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
)
export const LanguageIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8} aria-hidden="true">
    <path d="M3 5h12M9 3v2M5 5c1 6 5 9 9 10M13 5c-1 6-5 9-9 10M14 21l4-10 4 10M15.5 17h5" />
  </svg>
)

export const GearIcon = ({ size = 15 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)
export const LinkIcon = ({ size = 12 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)
export const ExternalLinkIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)
export const PhoneIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8} aria-hidden="true">
    <rect x="6" y="2" width="12" height="20" rx="2" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
)
export const EditIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
export const DetailLogIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
    <path d="M19 17V5a2 2 0 0 0-2-2H4" />
    <line x1="9" y1="9" x2="13" y2="9" />
    <line x1="9" y1="13" x2="15" y2="13" />
  </svg>
)
export const MoreIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
)
export const MoreCircleIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="7" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="17" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)
export const FolderIcon = ({ size = 11 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)
export const FolderOpenIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <path d="M6 14l1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.52 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
  </svg>
)
export const FileIcon = ({ size = 13 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)
export const AlertIcon = ({ size = 11 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.2}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)
export const CloseIcon = ({ size = 13 }: IconProps) => (
  <svg {...base(size)}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
export const ChevronRightIcon = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
export const TrashIcon = ({ size = 13 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)
export const RefreshIcon = ({ size = 13 }: IconProps) => (
  <svg {...base(size)}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)
export const ImportIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 1024 1024" fill="currentColor">
    <g transform="translate(512 512) scale(0.75) translate(-512 -512)">
      <path d="M0 841.264833m66.698336 0l889.920264 0q66.698336 0 66.698336 66.698336l0 49.338495q0 66.698336-66.698336 66.698336l-889.920264 0q-66.698336 0-66.698336-66.698336l0-49.338495q0-66.698336 66.698336-66.698336Z" />
      <path d="M571.412868 698.000462L798.18721 420.973948a19.187193 19.187193 0 0 0-14.984284-31.430448h-99.590666C683.61226 66.102254 395.987107 8.357941 240.84495 0.683064a18.273517 18.273517 0 0 0-10.050434 36.547033c115.30589 61.947222 166.106267 167.202678 172.136528 332.212534A19.187193 19.187193 0 0 1 383.743851 388.812559h-79.672533a19.187193 19.187193 0 0 0-14.801548 32.161389l226.774342 277.757455a36.547033 36.547033 0 0 0 55.368756-0.730941z" />
    </g>
  </svg>
)
export const ExportIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 1024 1024" fill="currentColor">
    <g transform="translate(512 512) scale(0.75) translate(-512 -512)">
      <path d="M0 841.264833m66.698336 0l889.920264 0q66.698336 0 66.698336 66.698336l0 49.338495q0 66.698336-66.698336 66.698336l-889.920264 0q-66.698336 0-66.698336-66.698336l0-49.338495q0-66.698336 66.698336-66.698336Z" />
      <path d="M571.412868 64.999538L798.18721 342.026052a19.187193 19.187193 0 0 1-14.984284 31.430448h-99.590666C683.61226 696.897746 395.987107 754.642059 240.84495 762.316936a18.273517 18.273517 0 0 1-10.050434-36.547033c115.30589-61.947222 166.106267-167.202678 172.136528-332.212534A19.187193 19.187193 0 0 0 383.743851 374.187441h-79.672533a19.187193 19.187193 0 0 1-14.801548-32.161389l226.774342-277.757455a36.547033 36.547033 0 0 1 55.368756 0.730941z" />
    </g>
  </svg>
)
export const CopyIcon = ({ size = 13 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)
export const ProxyIcon = ({ size = 10 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.2}>
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
)
export const ServerIcon = ({ size = 26 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
)
export const BackIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)
export const FinderIcon = ({ size = 13 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
)
export const CheckIcon = ({ size = 12, className }: IconProps) => (
  <svg {...base(size)} className={className} strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
export const HelpCircleIcon = ({ size = 12, className }: IconProps) => (
  <svg {...base(size)} className={className} strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
export const FilterIcon = ({ size = 13 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <rect x="3" y="5" width="18" height="2.5" rx="1.25" />
    <rect x="6" y="11" width="12" height="2.5" rx="1.25" />
    <rect x="9" y="17" width="6" height="2.5" rx="1.25" />
  </svg>
)

export const QrCodeIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="3" width="6" height="6" rx="1" />
    <rect x="3" y="15" width="6" height="6" rx="1" />
    <path d="M15 15h3v3h3v3h-6v-3M21 12v3M12 3v3M3 12h3M12 12h3M12 18v3" />
  </svg>
)
