import type { JSX } from "react/jsx-runtime"

export function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    "clear-night": (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
      </svg>
    ),
    cloudy: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    fog: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 15h18M3 9h18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    lightning: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor" />
      </svg>
    ),
    "lightning-rainy": (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor" opacity="0.7" />
        <path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    partlycloudy: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M18 16h-1.26A6 6 0 1 0 10 20h8a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    pouring: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" opacity="0.7" />
        <path
          d="M8 16l-2 4M12 16l-2 4M16 16l-2 4M10 13l-2 4M14 13l-2 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    rainy: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" opacity="0.7" />
        <path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    hail: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" opacity="0.7" />
        <circle cx="8" cy="20" r="1" fill="currentColor" />
        <circle cx="12" cy="20" r="1" fill="currentColor" />
        <circle cx="16" cy="20" r="1" fill="currentColor" />
      </svg>
    ),
    snowy: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" opacity="0.7" />
        <path
          d="M8 19l1-1m-1 1l-1-1m1 1v2M12 19l1-1m-1 1l-1-1m1 1v2M16 19l1-1m-1 1l-1-1m1 1v2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    "snowy-rainy": (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" opacity="0.7" />
        <path d="M8 19l-1 2M16 19l-1 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 19l1-1m-1 1l-1-1m1 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    sunny: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="5" fill="currentColor" />
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    windy: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "windy-variant": (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  }

  return icons[condition] || icons.sunny
}
