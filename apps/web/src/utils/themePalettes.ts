export interface PmiColorPalette {
  id: string;
  name: string;
  badge: string;
  description: string;
  swatches: {
    label: string;
    hex: string;
  }[];
  colors: {
    dark950: string;
    dark900: string;
    dark850: string;
    dark800: string;
    dark750: string;
    dark700: string;
    dark650: string;
    dark600: string;
    dark500: string;
    brandCyan: string;
    brandCyanLight: string;
    brandMagenta: string;
    brandMagentaLight: string;
    brandPurple: string;
    brandViolet: string;
    brandPmiOrange: string;
    brandPmiOrangeDark: string;
    brandNavy: string;
  };
}

export const THEME_PALETTE_STORAGE_KEY = 'tourlatam_theme_palette';
export const DEFAULT_PALETTE_ID = 'pmi-latam-neon';

export const PMI_COLOR_PALETTES: PmiColorPalette[] = [
  {
    id: 'pmi-latam-neon',
    name: 'PMI Cosmic Violet & Cyan',
    badge: 'Oficial TourLatam 2026',
    description:
      'Paleta oficial de TourLatam 2026 basada en el modo oscuro de PMI.org: fondo violeta cósmico con cian eléctrico, magenta vibrante y naranja PMI en llamados a la acción.',
    swatches: [
      { label: 'Fondo Base', hex: '#0B0418' },
      { label: 'Superficie', hex: '#1D0B38' },
      { label: 'PMI Cyan', hex: '#00F2FE' },
      { label: 'PMI Magenta', hex: '#FF007F' },
      { label: 'PMI Purple', hex: '#7928CA' },
      { label: 'PMI Orange', hex: '#FF5E14' },
    ],
    colors: {
      dark950: '#07020F',
      dark900: '#0B0418',
      dark850: '#0F0620',
      dark800: '#130924',
      dark750: '#180B2E',
      dark700: '#1D0B38',
      dark650: '#240E44',
      dark600: '#2F1258',
      dark500: '#3D1672',
      brandCyan: '#00F2FE',
      brandCyanLight: '#4FACFE',
      brandMagenta: '#FF007F',
      brandMagentaLight: '#F72585',
      brandPurple: '#7928CA',
      brandViolet: '#8338EC',
      brandPmiOrange: '#FF5E14',
      brandPmiOrangeDark: '#E04A05',
      brandNavy: '#0B0418',
    },
  },
  {
    id: 'pmi-flagship-orange',
    name: 'PMI.org Flagship (Flame Orange & Indigo)',
    badge: 'Identidad Global PMI.org',
    description:
      'La paleta insignia de pmi.org donde el Naranja Institucional PMI (#FF5E14) lidera los acentos principales junto al Turquesa PMI (#00C1D5) sobre fondo Índigo Profundo.',
    swatches: [
      { label: 'Deep Indigo', hex: '#100726' },
      { label: 'Indigo Card', hex: '#1E1142' },
      { label: 'PMI Orange', hex: '#FF6B1A' },
      { label: 'PMI Cyan', hex: '#00C1D5' },
      { label: 'PMI Amethyst', hex: '#6E3AFF' },
      { label: 'Flame CTA', hex: '#FF5E14' },
    ],
    colors: {
      dark950: '#090417',
      dark900: '#100726',
      dark850: '#150A30',
      dark800: '#190E38',
      dark750: '#1E1142',
      dark700: '#251550',
      dark650: '#2E1B61',
      dark600: '#3B2378',
      dark500: '#4C2E96',
      brandCyan: '#FF6B1A',
      brandCyanLight: '#FF8C42',
      brandMagenta: '#00C1D5',
      brandMagentaLight: '#22D3EE',
      brandPurple: '#6E3AFF',
      brandViolet: '#8B5CF6',
      brandPmiOrange: '#FF5E14',
      brandPmiOrangeDark: '#E04A05',
      brandNavy: '#100726',
    },
  },
  {
    id: 'pmi-executive-navy',
    name: 'PMI Executive Navy & Turquoise',
    badge: 'PMO & Governance',
    description:
      'Paleta corporativa inspirada en los reportes ejecutivos de PMI y PMO Global: azul marino profundo con turquesa institucional, azul cobalto y acentos cálidos en naranja.',
    swatches: [
      { label: 'Executive Navy', hex: '#061021' },
      { label: 'Navy Surface', hex: '#0F2342' },
      { label: 'PMI Turquoise', hex: '#00D2E6' },
      { label: 'PMI Orange', hex: '#FF6B1A' },
      { label: 'PMI Cobalt', hex: '#2563EB' },
      { label: 'Gold Accent', hex: '#F59E0B' },
    ],
    colors: {
      dark950: '#030914',
      dark900: '#061021',
      dark850: '#09162B',
      dark800: '#0C1C36',
      dark750: '#0F2342',
      dark700: '#142C52',
      dark650: '#193663',
      dark600: '#21447A',
      dark500: '#2B5699',
      brandCyan: '#00D2E6',
      brandCyanLight: '#38BDF8',
      brandMagenta: '#FF6B1A',
      brandMagentaLight: '#FB923C',
      brandPurple: '#2563EB',
      brandViolet: '#3B82F6',
      brandPmiOrange: '#FF5E14',
      brandPmiOrangeDark: '#E04A05',
      brandNavy: '#061021',
    },
  },
  {
    id: 'pmi-amethyst-berry',
    name: 'PMI NextGen Amethyst & Berry',
    badge: 'Agilidad & Liderazgo',
    description:
      'Paleta vibrante del sistema de diseño PMI NextGen para comunidades y Power Skills: ciruela profundo, magenta berry (#F72585), aqua luminoso y violeta amatista.',
    swatches: [
      { label: 'Deep Plum', hex: '#130521' },
      { label: 'Plum Card', hex: '#270B42' },
      { label: 'PMI Berry', hex: '#F72585' },
      { label: 'Bright Aqua', hex: '#00F5D4' },
      { label: 'Amethyst', hex: '#9B5DE5' },
      { label: 'PMI Orange', hex: '#FF5E14' },
    ],
    colors: {
      dark950: '#0A0213',
      dark900: '#130521',
      dark850: '#19072B',
      dark800: '#200936',
      dark750: '#270B42',
      dark700: '#300E52',
      dark650: '#3B1263',
      dark600: '#49177A',
      dark500: '#5C1E99',
      brandCyan: '#00F5D4',
      brandCyanLight: '#5EEAD4',
      brandMagenta: '#F72585',
      brandMagentaLight: '#FF4D9E',
      brandPurple: '#9B5DE5',
      brandViolet: '#B5179E',
      brandPmiOrange: '#FF5E14',
      brandPmiOrangeDark: '#E04A05',
      brandNavy: '#130521',
    },
  },
  {
    id: 'pmi-emerald-horizon',
    name: 'PMI Sustainability & Impact Teal',
    badge: 'Sostenibilidad & Valor',
    description:
      'Paleta de impacto social y sostenibilidad de PMI.org: pizarra oceánica profunda combinada con verde menta brillante, cian institucional y naranja PMI.',
    swatches: [
      { label: 'Deep Teal', hex: '#05151C' },
      { label: 'Ocean Card', hex: '#0D2E3D' },
      { label: 'PMI Mint', hex: '#10E8C6' },
      { label: 'PMI Sky', hex: '#00B4D8' },
      { label: 'Teal Accent', hex: '#0284C7' },
      { label: 'PMI Orange', hex: '#FF5E14' },
    ],
    colors: {
      dark950: '#020B0F',
      dark900: '#05151C',
      dark850: '#071C26',
      dark800: '#0A2430',
      dark750: '#0D2E3D',
      dark700: '#11384A',
      dark650: '#16455B',
      dark600: '#1C5570',
      dark500: '#246B8C',
      brandCyan: '#10E8C6',
      brandCyanLight: '#34D399',
      brandMagenta: '#FF6B2B',
      brandMagentaLight: '#FB923C',
      brandPurple: '#0284C7',
      brandViolet: '#00B4D8',
      brandPmiOrange: '#FF5E14',
      brandPmiOrangeDark: '#E04A05',
      brandNavy: '#05151C',
    },
  },
];

function hexToRgbChannels(hex: string): string {
  const clean = hex.replace('#', '').trim();
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

export function getPaletteById(paletteId?: string | null): PmiColorPalette {
  if (!paletteId) return PMI_COLOR_PALETTES[0];
  return PMI_COLOR_PALETTES.find((p) => p.id === paletteId) || PMI_COLOR_PALETTES[0];
}

export function applyThemePalette(paletteId?: string | null, persistLocal = true): PmiColorPalette {
  const palette = getPaletteById(paletteId);
  if (typeof document === 'undefined') return palette;

  const root = document.documentElement;
  const c = palette.colors;

  root.style.setProperty('--color-dark-950', hexToRgbChannels(c.dark950));
  root.style.setProperty('--color-dark-900', hexToRgbChannels(c.dark900));
  root.style.setProperty('--color-dark-850', hexToRgbChannels(c.dark850));
  root.style.setProperty('--color-dark-800', hexToRgbChannels(c.dark800));
  root.style.setProperty('--color-dark-750', hexToRgbChannels(c.dark750));
  root.style.setProperty('--color-dark-700', hexToRgbChannels(c.dark700));
  root.style.setProperty('--color-dark-650', hexToRgbChannels(c.dark650));
  root.style.setProperty('--color-dark-600', hexToRgbChannels(c.dark600));
  root.style.setProperty('--color-dark-500', hexToRgbChannels(c.dark500));

  root.style.setProperty('--color-brand-cyan', hexToRgbChannels(c.brandCyan));
  root.style.setProperty('--color-brand-cyan-light', hexToRgbChannels(c.brandCyanLight));
  root.style.setProperty('--color-brand-magenta', hexToRgbChannels(c.brandMagenta));
  root.style.setProperty('--color-brand-magenta-light', hexToRgbChannels(c.brandMagentaLight));
  root.style.setProperty('--color-brand-purple', hexToRgbChannels(c.brandPurple));
  root.style.setProperty('--color-brand-violet', hexToRgbChannels(c.brandViolet));
  root.style.setProperty('--color-brand-pmi-orange', hexToRgbChannels(c.brandPmiOrange));
  root.style.setProperty('--color-brand-pmi-orange-dark', hexToRgbChannels(c.brandPmiOrangeDark));
  root.style.setProperty('--color-brand-navy', hexToRgbChannels(c.brandNavy));

  root.setAttribute('data-pmi-theme', palette.id);

  if (persistLocal) {
    try {
      localStorage.setItem(THEME_PALETTE_STORAGE_KEY, palette.id);
    } catch {
      // ignore storage errors
    }
  }

  return palette;
}

export function initThemePaletteFromStorage(): PmiColorPalette {
  try {
    const stored = localStorage.getItem(THEME_PALETTE_STORAGE_KEY);
    if (stored) {
      return applyThemePalette(stored, false);
    }
  } catch {
    // ignore
  }
  return applyThemePalette(DEFAULT_PALETTE_ID, false);
}

