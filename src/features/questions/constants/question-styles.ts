export const LEVEL_COLORS = [
  'border-blue-200',
  'border-green-200',
  'border-purple-200'
] as const

export const LEVEL_BADGE_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700'
] as const

export const getLevelColors = (level: number): string => 
  LEVEL_COLORS[level] || LEVEL_COLORS[0]

export const getLevelBadgeColors = (level: number): string => 
  LEVEL_BADGE_COLORS[level] || LEVEL_BADGE_COLORS[0]
