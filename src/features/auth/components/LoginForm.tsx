import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithPin } from '../api'
import styles from './LoginForm.module.css'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Ingresa tu teléfono o cédula'),
  pin: z.string().length(4, 'El PIN debe tener exactamente 4 dígitos').regex(/^\d+$/, 'El PIN solo puede contener números'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(formData: LoginFormData) {
    setServerError(null)
    setIsSubmitting(true)
    const result = await loginWithPin(formData)
    setIsSubmitting(false)
    if (!result.success) {
      setServerError(result.error ?? 'Error al iniciar sesión')
      return
    }
    navigate('/')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.glowOrb} />
      <div className={styles.glowOrb2} />

      <div className={styles.brand}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className={styles.brandName}>Iron Fit</p>
        <p className={styles.brandSub}>Gimnasio</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="identifier" className={styles.label}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Teléfono o cédula
          </label>
          <input id="identifier" type="text" placeholder="98765432" className={styles.input} {...register('identifier')} />
          {errors.identifier && <span className={styles.error}>{errors.identifier.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="pin" className={styles.label}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            PIN
          </label>
          <input id="pin" type="password" inputMode="numeric" maxLength={4} placeholder="...." className={styles.input} {...register('pin')} />
          {errors.pin && <span className={styles.error}>{errors.pin.message}</span>}
        </div>

        {serverError && <p className={styles.serverError}>{serverError}</p>}

        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? (
            <span className={styles.btnLoading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.spinner}>
                <circle cx="12" cy="12" r="10" />
              </svg>
              Ingresando...
            </span>
          ) : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
