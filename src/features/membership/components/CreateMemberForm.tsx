import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateMember } from '../hooks/useCreateMember'
import styles from './CreateMemberForm.module.css'

const newMemberSchema = z
  .object({
    full_name: z.string().min(1, 'Requerido'),
    phone: z.string().min(1, 'Requerido'),
    cedula: z.string().min(1, 'Requerido'),
    pin: z.string().length(4, 'Debe tener 4 dígitos').regex(/^\d+$/, 'Solo números'),
    confirmPin: z.string(),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: 'Los PIN no coinciden',
    path: ['confirmPin'],
  })

type NewMemberFormData = z.infer<typeof newMemberSchema>

export function CreateMemberForm() {
  const createMember = useCreateMember()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successName, setSuccessName] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewMemberFormData>({
    resolver: zodResolver(newMemberSchema),
  })

  function onSubmit(data: NewMemberFormData) {
    setServerError(null)
    setSuccessName(null)

    createMember.mutate(
      {
        full_name: data.full_name,
        phone: data.phone,
        cedula: data.cedula,
        pin: data.pin,
      },
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
      {successName && (
        <p className={styles.successMessage}>✓ {successName} fue agregado correctamente</p>
      )}
      {serverError && <p className={styles.serverError}>{serverError}</p>}

      <div className={styles.field}>
        <label className={styles.label}>Nombre completo</label>
        <input className={styles.input} placeholder="Juan Pérez" {...register('full_name')} />
        {errors.full_name && <span className={styles.error}>{errors.full_name.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Teléfono</label>
        <input className={styles.input} placeholder="98765432" {...register('phone')} />
        {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Cédula</label>
        <input className={styles.input} placeholder="0801199912345" {...register('cedula')} />
        {errors.cedula && <span className={styles.error}>{errors.cedula.message}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>PIN (4 dígitos)</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            className={styles.input}
            {...register('pin')}
          />
          {errors.pin && <span className={styles.error}>{errors.pin.message}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Confirmar PIN</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            className={styles.input}
            {...register('confirmPin')}
          />
          {errors.confirmPin && <span className={styles.error}>{errors.confirmPin.message}</span>}
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={createMember.isPending}>
        {createMember.isPending ? 'Creando...' : 'Agregar socio'}
      </button>
    </form>
  )
}