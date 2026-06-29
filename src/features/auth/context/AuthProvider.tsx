import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import type { Profile } from '../types'
import { AuthContext, type AuthContextValue } from './AuthContext'

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, cedula, role, photo_url')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as Profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setProfile(null)
        setLoading(false)
        return
      }

      const profileData = await fetchProfile(session.user.id)
      setProfile(profileData)
      setLoading(false)
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  async function refreshProfile() {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) return
    const profileData = await fetchProfile(sessionData.session.user.id)
    setProfile(profileData)
  }

  const value: AuthContextValue = {
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    logout,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}