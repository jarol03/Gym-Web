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
    if (!qrToken) { setStatus('error'); setErrorMessage('Código QR inválido o incompleto'); return }
    if (!profile) { navigate('/login'); return }
    setStatus('checking'); setErrorMessage(null)
    const location = await requestLocation()
    if (!location) { setStatus('error'); setErrorMessage(geoError ?? 'No se pudo obtener tu ubicación'); return }
    const result = await checkinAttendance(profile.id, location.latitude, location.longitude, qrToken)
    if (!result.success) { setStatus('error'); setErrorMessage(result.error ?? 'No se pudo registrar tu asistencia'); return }
    setStatus('success')
  }

  if (!qrToken) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.bgGrid} />
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />

        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>

        <div className={styles.content}>
          <div className={styles.qrIcon}>
            <div className={styles.iconWrap}>
              <div className={styles.iconRing} />
              <div className={styles.iconRing2} />
              <div className={styles.iconRing3} />
              <div className={styles.iconShield}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <rect x="7" y="7" width="3" height="3" /><rect x="14" y="7" width="3" height="3" />
                  <rect x="7" y="14" width="3" height="3" /><rect x="14" y="14" width="3" height="3" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className={styles.title}>Escanea el QR</h1>
          <p className={styles.noTokenText}>
            Busca el código QR en la recepción del gimnasio y escanéalo con tu cámara
          </p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.bgGrid} />
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />

        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Inicio
        </button>

        <div className={styles.successBox}>
          <div className={styles.successIconWrap}>
            <div className={styles.successRing} />
            <div className={styles.successRing2} />
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className={styles.successTitle}>Asistencia registrada</h1>
          <p className={styles.successName}>Bienvenido, {profile?.full_name}</p>
        </div>

        <button className={styles.backBtnBottom} onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgGrid} />
      <div className={styles.glowOrb1} />
      <div className={styles.glowOrb2} />

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver
      </button>

      <div className={styles.content}>
        <div className={styles.iconWrap}>
          <div className={styles.iconRing} />
          <div className={styles.iconRing2} />
          <div className={styles.iconRing3} />
          <div className={styles.iconShield}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>
        <h1 className={styles.title}>Registrar asistencia</h1>
        <p className={styles.subtitle}>
          Verificaremos tu <strong>ubicación</strong> para confirmar que estás en el gimnasio
        </p>
        <button className={styles.checkinBtn} onClick={handleCheckin} disabled={status === 'checking' || geoLoading}>
          {status === 'checking' || geoLoading ? (
            <span className={styles.btnLoading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.spinner}>
                <circle cx="12" cy="12" r="10" />
              </svg>
              Verificando...
            </span>
          ) : 'Confirmar asistencia'}
        </button>
        {status === 'error' && errorMessage && (
          <div className={styles.errorBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  )
}
