export interface Profile {
  id: string
  full_name: string
  phone: string
  cedula: string
  role: 'admin' | 'member'
  photo_url: string | null
}

export interface LoginCredentials {
  identifier: string
  pin: string
}

export interface LoginResult {
  success: boolean
  access_token?: string
  refresh_token?: string
  error?: string
}