import React, { useState } from 'react';

// Mapping from common names (in Spanish/English) to ISO 3166-1 alpha-2 codes
const COUNTRY_MAP: Record<string, string> = {
  // Latin America & Caribbean
  bolivia: 'bo',
  colombia: 'co',
  mexico: 'mx',
  méxico: 'mx',
  peru: 'pe',
  perú: 'pe',
  argentina: 'ar',
  chile: 'cl',
  brasil: 'br',
  brazil: 'br',
  uruguay: 'uy',
  paraguay: 'py',
  ecuador: 'ec',
  venezuela: 've',
  panama: 'pa',
  panamá: 'pa',
  'costa rica': 'cr',
  costarica: 'cr',
  guatemala: 'gt',
  honduras: 'hn',
  'el salvador': 'sv',
  elsalvador: 'sv',
  nicaragua: 'ni',
  'republica dominicana': 'do',
  'república dominicana': 'do',
  dominicana: 'do',
  'puerto rico': 'pr',
  puertorico: 'pr',
  cuba: 'cu',

  // North America & Europe & International
  'estados unidos': 'us',
  eeuu: 'us',
  'ee.uu.': 'us',
  usa: 'us',
  us: 'us',
  canada: 'ca',
  canadá: 'ca',
  espana: 'es',
  españa: 'es',
  spain: 'es',
  alemania: 'de',
  germany: 'de',
  francia: 'fr',
  france: 'fr',
  italia: 'it',
  italy: 'it',
  'reino unido': 'gb',
  uk: 'gb',
  portugal: 'pt',
  japon: 'jp',
  japón: 'jp',
  japan: 'jp',
  china: 'cn',
};

function normalizeCountry(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function getCountryCode(country: string): string | null {
  if (!country) return null;
  const trimmed = country.trim();
  if (trimmed.length === 2) return trimmed.toLowerCase();

  const direct = COUNTRY_MAP[trimmed.toLowerCase()];
  if (direct) return direct;

  const normalized = normalizeCountry(trimmed);
  return COUNTRY_MAP[normalized] || null;
}

function getFlagEmoji(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface CountryFlagProps {
  country?: string | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  country,
  className = '',
  size = 'sm',
}) => {
  const [imgError, setImgError] = useState(false);

  if (!country) return null;

  const code = getCountryCode(country);
  if (!code) return null;

  const sizeClasses = {
    xs: 'w-3.5 h-2.5',
    sm: 'w-4 h-3',
    md: 'w-5 h-3.5',
  }[size];

  return (
    <span className={`inline-flex items-center shrink-0 select-none align-middle ${className}`} title={country}>
      {!imgError ? (
        <img
          src={`https://flagcdn.com/w40/${code}.png`}
          srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
          alt={`Bandera de ${country}`}
          className={`${sizeClasses} object-cover rounded-[2px] shadow-sm border border-white/25 shrink-0 inline-block`}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-xs leading-none shrink-0" role="img" aria-label={country}>
          {getFlagEmoji(code)}
        </span>
      )}
    </span>
  );
};
