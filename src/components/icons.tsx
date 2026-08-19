import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P): P => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const PlayIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4.5v15l12-7.5L7 4.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const PauseIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="6" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" />
    <rect x="14" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const ResetIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);

export const SkipIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 5v14l9-7-9-7z" fill="currentColor" stroke="none" />
    <path d="M18 5v14" />
  </svg>
);

export const TomatoIcon = (p: P) => (
  <svg {...base(p)} fill="none">
    <circle cx="12" cy="13.5" r="8" fill="#f4552f" stroke="none" />
    <ellipse cx="9.2" cy="10.6" rx="2.4" ry="1.2" fill="#fff" opacity=".22" stroke="none" transform="rotate(-24 9.2 10.6)" />
    <path d="M12 5.5c0-1.6 1-2.8 2.4-3.2-.5 1-.6 1.9-.4 2.7" stroke="#3fb87b" strokeWidth="1.8" />
    <path d="M12 5.8c-1.8-1.5-4-1.5-5.4-.4 1.9.2 3.2.8 4 1.7M12 5.8c1.8-1.5 4-1.5 5.4-.4-1.9.2-3.2.8-4 1.7" stroke="#3fb87b" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const TargetIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.2" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </svg>
);

export const CoffeeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M4 9h13v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z" />
    <path d="M8 3.5c-.8 1 .8 1.6 0 2.6M12 3.5c-.8 1 .8 1.6 0 2.6" />
  </svg>
);

export const MoonIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 13.5A8.5 8.5 0 0 1 10.5 4 7.5 7.5 0 1 0 20 13.5z" />
  </svg>
);

export const FlameIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-2.5-1.3-4.4-2.7-6C14.4 7.2 13 5.4 13 3c-3 2-4.2 4.6-4 7-1-.4-1.7-1.2-2-2.4C5.8 9 5.5 10.7 5.5 12.5 5.5 18.4 8.1 21 12 21z" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12.2A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.8L18 7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

export const PencilIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20l.9-3.8L16.4 4.7a2 2 0 0 1 2.9 0l.1.1a2 2 0 0 1 0 2.9L7.8 19.1 4 20z" />
    <path d="M14.5 6.5l3 3" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const ChevronDownIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ArrowUpIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export const ArrowDownIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

export const GearIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.8l1.2 2.3 2.6-.5 1 2.4 2.6.6-.4 2.6 2 1.8-1.4 2.2.9 2.5-2.4 1-.5 2.6-2.6-.4-1.8 2-2.2-1.4-2.5.9-1-2.4-2.6-.5.4-2.6-2-1.8 1.4-2.2-.9-2.5 2.4-1 .5-2.6 2.6.4 1.8-2 2.2 1.4 2.5-.9 1 2.4z" transform="scale(0.92) translate(1 1)" />
  </svg>
);

export const StopwatchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 9.5v4l2.8 1.6M9.5 2.5h5M12 2.5V6" />
  </svg>
);

export const ListIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 6h12M9 12h12M9 18h12" />
    <circle cx="4.5" cy="6" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
    <path d="M3.4 18l1.2 1.2 2-2.4" />
  </svg>
);

export const CalendarIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M3.5 10h17M8 2.8V7M16 2.8V7" />
  </svg>
);

export const SparkIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z" fill="currentColor" stroke="none" />
    <path d="M18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" fill="currentColor" stroke="none" />
  </svg>
);

export const BookIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 4.5h6a4 4 0 0 1 4 4v11.5a3 3 0 0 0-3-3h-7V4.5z" />
    <path d="M21.5 4.5h-6a4 4 0 0 0-4 4v11.5a3 3 0 0 1 3-3h7V4.5z" />
  </svg>
);

export const OfflineIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5l3 2" />
  </svg>
);
