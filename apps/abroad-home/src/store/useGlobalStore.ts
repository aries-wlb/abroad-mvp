import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import type { UserState } from './createUserSlice'
import { createUserSlice } from './createUserSlice'

interface LoginModalState {
  loginOpen: boolean
  next?: string
  setOpen: (open: boolean, next?: string) => void
}

const createLoginModalSlice: StateCreator<LoginModalState> = (set, _) => ({
  loginOpen: false,
  setOpen: async (open: boolean, next?: string) => {
    set({
      loginOpen: open,
      next,
    })
  },
})

type GlobalState = UserState & LoginModalState

export const useGlobalStore = create<GlobalState>((...a) => ({
  ...createUserSlice(...a),
  ...createLoginModalSlice(...a),
}))
