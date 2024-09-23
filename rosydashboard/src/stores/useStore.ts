import create from 'zustand'

interface AppState {
  counter: number;
  increaseCounter: () => void;
  resetCounter: () => void;
}

const useStore = create<AppState>((set) => ({
  counter: 0,
  increaseCounter: () => set((state) => ({ counter: state.counter + 1 })),
  resetCounter: () => set(() => ({ counter: 0 })),
}));

export default useStore;
