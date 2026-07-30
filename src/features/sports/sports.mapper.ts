import type { Sport, SportChipItem } from './sports.type';

const SPORT_EMOJI: Record<string, string> = {
  badminton: '🏸',
  'cau-long': '🏸',
  football: '⚽',
  'bong-da': '⚽',
  soccer: '⚽',
  tennis: '🎾',
  pickleball: '🏓',
  basketball: '🏀',
  'bong-ro': '🏀',
  volleyball: '🏐',
  'bong-chuyen': '🏐',
  tabletennis: '🏓',
  'bong-ban': '🏓',
  golf: '⛳',
  swimming: '🏊',
  gym: '💪',
  futsal: '⚽',
};

export function getSportEmoji(slug: string, name?: string): string {
  const normalizedSlug = slug.toLowerCase();
  if (SPORT_EMOJI[normalizedSlug]) {
    return SPORT_EMOJI[normalizedSlug];
  }

  const normalizedName = name?.toLowerCase() ?? '';
  for (const [key, emoji] of Object.entries(SPORT_EMOJI)) {
    if (normalizedName.includes(key.replace(/-/g, ' ')) || normalizedName.includes(key)) {
      return emoji;
    }
  }

  if (normalizedName.includes('cầu lông') || normalizedName.includes('cau long')) return '🏸';
  if (normalizedName.includes('bóng đá') || normalizedName.includes('bong da')) return '⚽';
  if (normalizedName.includes('tennis')) return '🎾';
  if (normalizedName.includes('pickleball')) return '🏓';

  return '🏟️';
}

export function filterActiveSports(sports: Sport[]): Sport[] {
  return sports.filter((sport) => sport.status === 'active');
}

export function mapSportsToChipItems(sports: Sport[]): SportChipItem[] {
  return filterActiveSports(sports).map((sport) => ({
    id: sport.id,
    label: sport.name,
    emoji: getSportEmoji(sport.slug, sport.name),
  }));
}

export function buildSportFilterOptions(sports: Sport[]): SportChipItem[] {
  return [{ id: 'all', label: 'Tất cả', emoji: '🏟️' }, ...mapSportsToChipItems(sports)];
}
