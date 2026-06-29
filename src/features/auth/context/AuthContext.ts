import { createContext } from 'react'
import type { Profile } from '../types'

export interface AuthContextValue {
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)