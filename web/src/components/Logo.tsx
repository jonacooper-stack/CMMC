type LogoProps = {
  variant?: "navy" | "white";
  className?: string;
};

/** Muster wordmark: a tally mark (roll-call / "count your 110 controls") whose
 *  fifth stroke is the green "cleared / passed muster" slash, beside the wordmark. */
export default function Logo({ variant = "navy", className }: LogoProps) {
  const ink = variant === "white" ? "#ffffff" : "#0a2540";
  return (
    <svg
      viewBox="0 0 210 48"
      className={className}
      role="img"
      aria-label="Muster"
    >
      <g stroke={ink} strokeWidth="3.4" strokeLinecap="round">
        <line x1="7" y1="12" x2="7" y2="40" />
        <line x1="16" y1="12" x2="16" y2="40" />
        <line x1="25" y1="12" x2="25" y2="40" />
        <line x1="34" y1="12" x2="34" y2="40" />
      </g>
      <line
        x1="3"
        y1="42"
        x2="38"
        y2="10"
        stroke="#1b9e69"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <text
        x="50"
        y="37"
        fontFamily="var(--font-geist-sans), system-ui, sans-serif"
        fontSize="34"
        fontWeight="700"
        fill={ink}
        letterSpacing="-0.5"
      >
        Muster
      </text>
    </svg>
  );
}
