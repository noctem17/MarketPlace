import { create } from 'zustand';
import type { Store } from '../constants/types';

interface GameState {
  activeStore: Store | null;
  nearbyStore: Store | null;
  playerPosition: { x: number; z: number };
  openStore: (store: Store) => void;
  closeStore: () => void;
  setNearbyStore: (store: Store | null) => void;
  setPlayerPosition: (x: number, z: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeStore: null,
  nearbyStore: null,
  playerPosition: { x: 0, z: 0 },
  openStore: (store) => set({ activeStore: store }),
  closeStore: () => set({ activeStore: null }),
  setNearbyStore: (store) => set({ nearbyStore: store }),
  setPlayerPosition: (x, z) => set({ playerPosition: { x, z } }),
}));