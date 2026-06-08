export interface Theme {
  pageBg: string;
  cardBg: string;
  cardBg2: string;
  chipBg: string;
  chipHover: string;
  deepBg: string;
  accent: string;
  accentSoft: string;
  accentGlow: string;
  accentGlowStrong: string;
  titleColor: string;
  subColor: string;
  mutedColor: string;
  labelColor: string;
  border: string;
  shadow: string;
  navBg: string;
  selectedText: string;
  selectedTextSub: string;
}

export const ramenTheme: Theme = {
  pageBg:           '#FFFBF5',
  cardBg:           '#FFFFFF',
  cardBg2:          '#FDF8F2',
  chipBg:           '#F2EBE0',
  chipHover:        '#EAE0D4',
  deepBg:           '#EDE5D8',
  accent:           '#E87C2A',
  accentSoft:       '#F0A050',
  accentGlow:       'rgba(232,124,42,0.25)',
  accentGlowStrong: 'rgba(232,124,42,0.45)',
  titleColor:       '#2C1A0E',
  subColor:         '#7A4F30',
  mutedColor:       '#B08060',
  labelColor:       '#FFFFFF',
  border:           'rgba(180,130,90,0.22)',
  shadow:           'rgba(120,70,20,0.10)',
  navBg:            'rgba(255,251,245,0.97)',
  selectedText:     '#FFFFFF',
  selectedTextSub:  'rgba(255,255,255,0.75)',
};
