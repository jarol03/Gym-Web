import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useRef } from 'react'
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
  const [isPinFocused, setIsPinFocused] = useState(false)
  const pinRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', pin: '' },
  })

  const pinValue = useWatch({ control, name: 'pin' }) || ''
  const identifierValue = useWatch({ control, name: 'identifier' }) || ''

  const { ref: registerPinRef } = register('pin')

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

  function handlePinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4)
    setValue('pin', cleaned, { shouldValidate: true })
  }

  function handlePinKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && pinValue.length > 0) {
      setValue('pin', pinValue.slice(0, -1), { shouldValidate: true })
    }
    if (e.key === 'Enter' && pinValue.length === 4 && identifierValue.length >= 1) {
      handleSubmit(onSubmit)()
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgGrid} />
      <div className={styles.glowOrb} />
      <div className={styles.glowOrb2} />

      <div className={styles.brand}>
        <div className={styles.logoWrap}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.536 8.464a5 5 0 0 1 0 7.072m-2.828-9.9a7.5 7.5 0 0 1 0 10.606m-2.828-12.02a10 10 0 0 1 0 14.142" />
            <path d="M6 16c0-2.5 2-5 6-5s6 2.5 6 5" />
            <path d="M4 18c0-4 3-8 8-8s8 4 8 8" />
            <path d="M12 3v3" />
            <path d="M12 18v3" />
          </svg>
        </div>
        <h1 className={styles.brandName}>Gym 21 de Febrero</h1>
        <p className={styles.brandSub}>Gimnasio</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} autoComplete="off">
        <div className={styles.field}>
          <label htmlFor="identifier" className={styles.label}>Teléfono o cédula</label>
          <div className={styles.inputWrap}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.inputIcon}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <input
              id="identifier"
              type="text"
              placeholder="98765432"
              className={`${styles.input} ${errors.identifier ? styles.inputError : ''}`}
              autoCapitalize="none"
              autoCorrect="off"
              {...register('identifier')}
            />
          </div>
          {errors.identifier && <span className={styles.error}>{errors.identifier.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="pin" className={styles.label}>PIN de acceso</label>
          <div className={styles.pinContainer}>
            <input
              id="pin"
              type="text"
              inputMode="numeric"
              maxLength={4}
              className={styles.pinHidden}
              value={pinValue}
              onChange={handlePinChange}
              onKeyDown={handlePinKeyDown}
              onFocus={() => setIsPinFocused(true)}
              onBlur={() => setIsPinFocused(false)}
              ref={(e) => {
                registerPinRef(e)
                pinRef.current = e
              }}
              autoComplete="off"
            />
            <div className={styles.pinDisplay} onClick={() => pinRef.current?.focus()}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${styles.pinDot} ${pinValue.length > i ? styles.pinDotFilled : ''} ${isPinFocused && pinValue.length === i ? styles.pinDotActive : ''}`}
                >
                  {pinValue.length > i && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="12" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
          {errors.pin && <span className={styles.error}>{errors.pin.message}</span>}
        </div>

        {serverError && (
          <div className={styles.serverError}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {serverError}
          </div>
        )}

        <button type="submit" disabled={isSubmitting || pinValue.length !== 4} className={styles.submitButton}>
          {isSubmitting ? (
            <span className={styles.btnLoading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.spinner}>
                <circle cx="12" cy="12" r="10" />
              </svg>
              Ingresando...
            </span>
          ) : (
            <>
              Ingresar
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
