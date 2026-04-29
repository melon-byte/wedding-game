export interface Guest {
  id: string
  name: string
  phoneSuffix: string
  avatar: string
  scores: Record<string, number>
  choices: Record<string, string>
  totalPoints: number
  createdAt: number
}

export interface Checkpoint {
  id: string
  title: string
  subtitle: string
  themeA: string
  themeB: string
  descA: string
  descB: string
  scoringA: string
  scoringB: string
  type: 'solo' | 'team'
  duration: string
}

export type Phase = 'checkin' | 'playing' | 'settled'

export interface GameState {
  phase: Phase
  guests: Guest[]
  currentGuestId: string | null
}

export const AVATARS = [
  '🐱', '🐶', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷',
  '🐸', '🐵', '🐔', '🐧', '🦊', '🐙', '🦋', '🐌', '🐝', '🐞',
  '🐢', '🐬', '🐳', '🦄', '🐲', '🐥', '🦉', '🦇', '🐿', '🦔',
  '🦩', '🦜', '🐊', '🦎', '🐡', '🦭', '🦥', '🦦', '🐩', '🐈',
  '🦢', '🦚', '🐉', '🐾', '🦝',
] as const

export const BRIDE_ATTRS = ['communication', 'aesthetic', 'lifestyle'] as const
export const GROOM_ATTRS = ['execution', 'attitude', 'choice'] as const

export const ADMIN_PASSWORD = 'gugugaga'

export const NPC_PASSWORD = '0605'

export const STORAGE_KEY = 'wedding-game-state-v2'
