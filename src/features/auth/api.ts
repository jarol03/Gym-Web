import { supabase } from '../../shared/lib/supabase'
import type { LoginCredentials, LoginResult } from './types'

export async function loginWithPin(credentials: LoginCredentials): Promise<LoginResult> {
  await supabase.auth.signOut()

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const response = await fetch(`${supabaseUrl}/functions/v1/login-with-pin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      // Notá que deliberadamente NO mandamos el header Authorization
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()
  console.log('Status:', response.status, 'Data:', data)

  if (!response.ok || !data.success) {
    return { success: false, error: data.error ?? 'Teléfono o PIN incorrecto' }
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  })

  if (sessionError) {
    return { success: false, error: 'No se pudo iniciar sesión' }
  }

  return { success: true }
}