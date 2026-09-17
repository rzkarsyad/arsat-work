import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19 12H5m6-6-6 6 6 6" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function Reset(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
    </svg>
  );
}

export function Sun(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function Moon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function Expand(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 4h6v6M10 20H4v-6M20 4l-6 6M4 20l6-6" />
    </svg>
  );
}

export function XLogo(props: IconProps) {
  return (
    <svg {...base(props)} stroke="none" fill="currentColor">
      <path d="M17.7 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L1.7 3h6.4l4.4 5.9L17.7 3Zm-1.1 16.2h1.7L7.1 4.7H5.3l11.3 14.5Z" />
    </svg>
  );
}

export function LinkedIn(props: IconProps) {
  return (
    <svg {...base(props)} stroke="none" fill="currentColor">
      <path d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2ZM8 19H5V9.5h3V19ZM6.5 8.2a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5ZM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5S12.7 13 12.7 14.3V19h-3V9.5h2.9v1.3h.1c.4-.8 1.4-1.6 2.9-1.6 3 0 3.6 2 3.6 4.6V19Z" />
    </svg>
  );
}

/**
 * Contra's mark: four concave petals parted by a cross. The gap is cut into
 * the path itself, so the icon sits on any background; the placeholder drew
 * it as a stroke in the canvas colour and smeared on anything else.
 */
export function Contra(props: IconProps) {
  return (
    <svg {...base(props)} stroke="none" fill="currentColor">
      <path d="M12.7216 11.4203H21.7409C21.8852 11.4203 21.9573 11.4203 21.9573 11.2753V10.9855C21.9573 10.9131 21.9573 10.8406 21.813 10.8406C17.5559 9.6812 14.2368 6.4203 13.1545 2.1449L12.8659 2H12.6494C12.5772 2 12.5051 2.0725 12.5051 2.2174V11.2753C12.5051 11.3478 12.5051 11.4203 12.6494 11.4203H12.7216ZM12.7216 22H13.0102L13.1545 21.8551C14.309 17.5797 17.5559 14.2464 21.813 13.1594L21.9573 12.942V12.7247C21.9573 12.6522 21.8852 12.5073 21.7409 12.5073H12.7216L12.5772 12.7247V21.7826C12.5772 21.9275 12.5772 22 12.7216 22ZM11.062 22H11.2784C11.3506 22 11.4228 21.9275 11.4228 21.7826V12.7247C11.4228 12.6522 11.4228 12.5073 11.2784 12.5073H2.2591C2.1148 12.5073 2.0427 12.6522 2.0427 12.7247V13.0145C2.0427 13.0869 2.0427 13.1594 2.187 13.1594C6.4441 14.2464 9.7632 17.5797 10.8455 21.8551L11.062 22ZM2.2591 11.4203H11.2784C11.3506 11.4203 11.4228 11.4203 11.4228 11.2753V2.2174C11.4228 2.0725 11.4228 2 11.2784 2H10.9898C10.9177 2 10.8455 2 10.8455 2.1449C9.6911 6.3478 6.372 9.7536 2.187 10.8406L2.0427 11.058V11.2753C2.0427 11.3478 2.1148 11.4203 2.2591 11.4203Z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7.5 8.5 6 8.5-6" />
    </svg>
  );
}

export function SoundOn(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

export function SoundOff(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </svg>
  );
}
