import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { GameState } from './types'
import { loadState, saveState } from './state'
import SignIn from './SignIn'
import Lobby from './Lobby'
import Checkpoint from './Checkpoint'
import Admin from './Admin'
import Settlement from './Settlement'
import './App.css'

let listeners: Array<() => void> = []

export function getGameState(): GameState {
  return loadState()
}

export function setGameState(s: GameState): void {
  saveState(s)
  listeners.forEach((cb) => cb())
}

export function useGameState(): GameState {
  const [, setTick] = useState(0)
  useEffect(() => {
    const cb = () => setTick((t) => t + 1)
    listeners.push(cb)
    return () => {
      listeners = listeners.filter((l) => l !== cb)
    }
  }, [])
  return getGameState()
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/checkpoint/:id" element={<Checkpoint />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/settlement" element={<Settlement />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
