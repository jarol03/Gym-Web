import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useGeolocation } from '../hooks/useGeolocation'
import { checkinAttendance } from '../api'
import styles from './CheckinPage.module.css'

export function CheckinPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { error: geoError, loading: geoLoading, requestLocation } = useGeolocation()

  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const qrToken = searchParams.get('token')

  async function handleCheckin() {
    if (!qrToken) {
      setStatus('error')
      setErrorMessage('Código QR inválido o incompleto')
      return
    }

    if (!profile) {
      navigate('/login')
      return
    }

    setStatus('checking')
    setErrorMessage(null)

    const location = await requestLocation()

    if (!location) {
      setStatus('error')
      setErrorMessage(geoError ?? 'No se pudo obtener tu ubicación')
      return
    }

    const result = await checkinAttendance(profile.id, location.latitude, location.longitude, qrToken)

    if (!result.success) {
      setStatus('error')
      setErrorMessage(result.error ?? 'No se pudo registrar tu asistencia')
      return
    }

    setStatus('success')
  }

  if (!qrToken) {
    return (
      <div className={styles.container}>
        <p className={styles.title}>Código QR inválido</p>
        <p className={styles.subtitle}>Escanea el código QR ubicado en el gimnasio para registrar tu asistencia.</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className={styles.container}>
        <div className={styles.successBox}>
          <p className={styles.title} style={{ color: '#15803d' }}>¡Asistencia registrada!</p>
          <p>Bienvenido al gym, {profile?.full_name}.</p>
        </div>
        <button className={styles.button} style={{ marginTop: 20 }} onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>Registrar asistencia</p>
      <p className={styles.subtitle}>
        Vamos a verificar tu ubicación para confirmar que estás en el gimnasio.
      </p>

      <button
        className={styles.button}
        onClick={handleCheckin}
        disabled={status === 'checking' || geoLoading}
      >
        {status === 'checking' || geoLoading ? 'Verificando ubicación...' : 'Confirmar asistencia'}
      </button>

      {status === 'error' && errorMessage && (
        <div className={styles.errorBox}>{errorMessage}</div>
      )}
    </div>
  )
}