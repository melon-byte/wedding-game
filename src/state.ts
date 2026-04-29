import type { GameState, Guest, Phase } from './types'
import { STORAGE_KEY } from './types'

export function getInitialState(): GameState {
  return {
    phase: 'checkin',
    guests: [],
    currentGuestId: null,
  }
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getInitialState()
    return JSON.parse(raw) as GameState
  } catch {
    return getInitialState()
  }
}

export function saveState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function generateGuestId(): string {
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function createGuest(name: string, phoneSuffix: string, avatar: string): Guest {
  return {
    id: generateGuestId(),
    name,
    phoneSuffix,
    avatar,
    scores: {},
    choices: {},
    totalPoints: 0,
    createdAt: Date.now(),
  }
}

export function addGuest(state: GameState, guest: Guest): GameState {
  return {
    ...state,
    guests: [...state.guests, guest],
    currentGuestId: guest.id,
  }
}

export function removeGuest(state: GameState, guestId: string): GameState {
  return {
    ...state,
    guests: state.guests.filter((g) => g.id !== guestId),
    currentGuestId: state.currentGuestId === guestId ? null : state.currentGuestId,
  }
}

export function saveScore(
  state: GameState,
  guestId: string,
  checkpointId: string,
  choice: string,
  score: number,
): GameState {
  const guests = state.guests.map((g) => {
    if (g.id !== guestId) return g
    const scores = { ...g.scores, [checkpointId]: score }
    const choices = { ...g.choices, [checkpointId]: choice }
    const totalPoints = Object.values(scores).reduce((sum, s) => sum + s, 0)
    return { ...g, scores, choices, totalPoints }
  })
  return { ...state, guests }
}

export function setPhase(state: GameState, phase: Phase): GameState {
  return { ...state, phase }
}

export function setCurrentGuest(state: GameState, guestId: string | null): GameState {
  return { ...state, currentGuestId: guestId }
}
