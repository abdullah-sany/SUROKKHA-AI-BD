import type { SVGProps } from "react";

/**
 * Hand-drawn, purpose-specific line icons (section 6: "meaningful medical
 * icon... do not reuse the same icon for every card"). Kept as one file
 * of small stroke-based SVGs so the whole app shares one visual language
 * without pulling in an icon library dependency.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconCut(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6 L18 18" />
      <path d="M6 18 L18 6" />
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <path d="M13 11 L20 4" strokeDasharray="1.5 2.5" />
    </svg>
  );
}

export function IconBurn(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c1.2 2 3 3.4 3 6a3 3 0 1 1-6 0c0-.9.3-1.6.7-2.2C10 8 10 9.4 11 10c-.4-2 .6-3.4 1-4.5.3-.8.3-1.6 0-2.5Z" />
      <path d="M8 21c-1.5-1-2-2.3-2-3.5C6 15.5 8 14 8 14s.5 2 2 2.5c1 .3 1.7-.4 1.7-1.3 0 0 2.3 1.2 2.3 3.3 0 1.2-.8 2-1.5 2.5" />
    </svg>
  );
}

export function IconFainting(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="5.5" r="2" />
      <path d="M7 9 L11 12 L9 20" />
      <path d="M11 12 L17 10" />
      <path d="M9 20 L4 20" />
      <path d="M14 6 L17 9 M17 6 L14 9" opacity="0.6" />
    </svg>
  );
}

export function IconNosebleed(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c2.5 3 4 5.7 4 8a4 4 0 0 1-8 0c0-2.3 1.5-5 4-8Z" />
      <path d="M11 15 Q10.3 17 11 19" strokeDasharray="1.4 1.8" />
      <path d="M13 15 Q13.7 18 13 20.5" strokeDasharray="1.4 1.8" />
    </svg>
  );
}

export function IconChoking(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="6" r="2.3" />
      <path d="M12 8.3 V15" />
      <path d="M8.5 12 H15.5" />
      <path d="M9 12 C7 13 7 15.5 9 16.5" />
      <path d="M15 12 C17 13 17 15.5 15 16.5" />
      <path d="M12 15 L10 20 M12 15 L14 20" />
    </svg>
  );
}

export function IconPhysicalInjury(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7 V13 M12 13 L8 20 M12 13 L16 20" />
      <path d="M8 10 L16 10" />
      <path d="M14 3.5 L18 3.5 M16 1.5 L16 5.5" strokeWidth="1.5" />
    </svg>
  );
}

export function IconAmbulance(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 16 V9 a1 1 0 0 1 1-1 h9 l4 4 h2 a1 1 0 0 1 1 1 v3" />
      <path d="M3 16 h16" />
      <circle cx="7.5" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
      <path d="M8 12 v-3 M6.5 10.5 h3" />
    </svg>
  );
}

export function IconHospital(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21 V6 a1 1 0 0 1 1-1 h6 a1 1 0 0 1 1 1 v15" />
      <path d="M12 21 V11 a1 1 0 0 1 1-1 h6 a1 1 0 0 1 1 1 v10" />
      <path d="M8 9 v-3 M6.5 7.5 h3" />
      <path d="M4 21 H20" />
      <path d="M15 16 v3 M13.5 17.5 h3" />
    </svg>
  );
}

export function IconBlood(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c2.7 3.2 6 7.2 6 10.7A6 6 0 1 1 6 13.7C6 10.2 9.3 6.2 12 3Z" />
    </svg>
  );
}

export function IconPrescription(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 3h9a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 1-2Z" />
      <path d="M8 8 h6 M8 11.5 h6 M8 15 h3" />
    </svg>
  );
}

export function IconSpecialist(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="7.5" r="3.2" />
      <path d="M4.5 21 c0-4.5 3.5-6.8 7.5-6.8s7.5 2.3 7.5 6.8" />
      <path d="M15.5 5.2 c1.6.4 2.5 1.7 2.5 3.3 0 1.1-.5 2.1-1.3 2.7" opacity="0.6" />
    </svg>
  );
}

export function IconTimeline(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6 h16 M4 12 h16 M4 18 h10" />
      <circle cx="4" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconHome(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11 L12 4 L20 11" />
      <path d="M6 10 V20 H18 V10" />
      <path d="M10 20 V14 H14 V20" />
    </svg>
  );
}

export function IconEmergency(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2 L21 20 H3 Z" />
      <path d="M12 9 V14" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C10.6 19 5 13.4 4.5 6.6 4.4 5.6 4.6 4.6 5 4Z" />
    </svg>
  );
}

export function IconDirections(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="6.5" />
      <path d="M12 6 L14.5 9 L12 12 L9.5 9 Z" fill="currentColor" stroke="none" />
      <path d="M12 15.5 V22" strokeDasharray="1.5 2" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20 L15.2 15.2" />
    </svg>
  );
}

export function IconVoice(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11 a6 6 0 0 0 12 0" />
      <path d="M12 17 V21 M9 21 H15" />
    </svg>
  );
}

export function IconCamera(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8 h3 l1.5-2 h7 L17 8 h3 a1 1 0 0 1 1 1 v10 a1 1 0 0 1-1 1 H4 a1 1 0 0 1-1-1 V9 a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.4" />
    </svg>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 15 V4 M8 8 L12 4 L16 8" />
      <path d="M4 15 v3 a2 2 0 0 0 2 2 h12 a2 2 0 0 0 2-2 v-3" />
    </svg>
  );
}

export function IconWarning(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 L21.5 19.5 H2.5 Z" />
      <path d="M12 9.5 V14" />
      <circle cx="12" cy="16.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12.5 L9.5 18 L20 5" />
    </svg>
  );
}

export function IconBloodDrop(props: IconProps) {
  return <IconBlood {...props} />;
}

export function IconSettings(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2 M12 18.5v2 M3.5 12h2 M18.5 12h2 M6 6l1.4 1.4 M16.6 16.6L18 18 M6 18l1.4-1.4 M16.6 7.4L18 6" />
    </svg>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 7 h14 M9 7 V5 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 v2 M7 7 l1 13 a1 1 0 0 0 1 1 h6 a1 1 0 0 0 1-1 l1-13" />
      <path d="M10 11 v6 M14 11 v6" />
    </svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11 V17" />
      <circle cx="12" cy="7.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21 C8 16.5 5.5 13 5.5 9.5 a6.5 6.5 0 1 1 13 0 C18.5 13 16 16.5 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}
