import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithPin } from '../api'
import styles from './LoginForm.module.css'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Ingresa tu teléfono o cédula'),
  pin: z
    .string()
    .length(4, 'El PIN debe tener exactamente 4 dígitos')
    .regex(/^\d+$/, 'El PIN solo puede contener números'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(formData: LoginFormData) {
  setServerError(null)
  setIsSubmitting(true)

  const result = await loginWithPin(formData)
  console.log('Resultado del login:', result)  // ← agregá esta línea temporalmente

  setIsSubmitting(false)

  if (!result.success) {
    setServerError(result.error ?? 'Error al iniciar sesión')
    return
  }

  navigate('/')
}

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h1 className={styles.title}>Ingresar</h1>

      <div className={styles.field}>
        <label htmlFor="identifier" className={styles.label}>Teléfono o cédula</label>
        <input
          id="identifier"
          type="text"
          placeholder="98765432"
          className={styles.input}
          {...register('identifier')}
        />
        {errors.identifier && <span className={styles.error}>{errors.identifier.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="pin" className={styles.label}>PIN</label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="••••"
          className={styles.input}
          {...register('pin')}
        />
        {errors.pin && <span className={styles.error}>{errors.pin.message}</span>}
      </div>

      {serverError && <p className={styles.serverError}>{serverError}</p>}

      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}