import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateMember } from '../hooks/useCreateMember'
import styles from './CreateMemberForm.module.css'

const newMemberSchema = z.object({
  full_name: z.string().min(1, 'Requerido'),
  phone: z.string().min(1, 'Requerido'),
  cedula: z.string().min(1, 'Requerido'),
  pin: z.string().length(4, 'Debe tener 4 dígitos').regex(/^\d+$/, 'Solo números'),
  confirmPin: z.string(),
}).refine((data) => data.pin === data.confirmPin, {
  message: 'Los PIN no coinciden',
  path: ['confirmPin'],
})

type NewMemberFormData = z.infer<typeof newMemberSchema>

export function CreateMemberForm() {
  const createMember = useCreateMember()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successName, setSuccessName] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewMemberFormData>({
    resolver: zodResolver(newMemberSchema),
  })

  function onSubmit(data: NewMemberFormData) {
    setServerError(null)
    setSuccessName(null)
    createMember.mutate(
      { full_name: data.full_name, phone: data.phone, cedula: data.cedula, pin: data.pin },
      {
        onSuccess: (result) => {
          if (result.success) {
            setSuccessName(data.full_name)
            reset()
          } else {
            setServerError(result.error ?? 'No se pudo crear el socio')
          }
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formHeader}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
        </svg>
        <span>Nuevo socio</span>
      </div>

      {successName && <p className={styles.successMessage}>{successName} fue agregado</p>}
      {serverError && <p className={styles.serverError}>{serverError}</p>}

      <div className={styles.field}>
        <label className={styles.label}>Nombre completo</label>
        <input className={styles.input} placeholder="Juan Pérez" {...register('full_name')} />
        {errors.full_name && <span className={styles.error}>{errors.full_name.message}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Teléfono</label>
          <input className={styles.input} placeholder="98765432" {...register('phone')} />
          {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Cédula</label>
          <input className={styles.input} placeholder="0801..." {...register('cedula')} />
          {errors.cedula && <span className={styles.error}>{errors.cedula.message}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>PIN</label>
          <input type="password" inputMode="numeric" maxLength={4} className={styles.input} {...register('pin')} />
          {errors.pin && <span className={styles.error}>{errors.pin.message}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Confirmar PIN</label>
          <input type="password" inputMode="numeric" maxLength={4} className={styles.input} {...register('confirmPin')} />
          {errors.confirmPin && <span className={styles.error}>{errors.confirmPin.message}</span>}
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={createMember.isPending}>
        {createMember.isPending ? 'Creando...' : 'Agregar socio'}
      </button>
    </form>
  )
}
