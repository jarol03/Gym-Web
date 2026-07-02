import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateAnnouncement } from '../hooks/useAnnouncementMutations'
import styles from './CreateAnnouncementForm.module.css'

const announcementSchema = z.object({
  title: z.string().min(1, 'Requerido').max(100, 'Máximo 100 caracteres'),
  body: z.string().min(1, 'Requerido').max(1000, 'Máximo 1000 caracteres'),
})

type AnnouncementFormData = z.infer<typeof announcementSchema>

export function CreateAnnouncementForm() {
  const createAnnouncement = useCreateAnnouncement()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
  })

  function onSubmit(data: AnnouncementFormData) {
    createAnnouncement.mutate(data, { onSuccess: () => reset() })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formHeader}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Nuevo anuncio</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Título</label>
        <input className={styles.input} placeholder="Cierre por mantenimiento" {...register('title')} />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Mensaje</label>
        <textarea className={styles.textarea} placeholder="El gym cerrará el..." {...register('body')} />
        {errors.body && <span className={styles.error}>{errors.body.message}</span>}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={createAnnouncement.isPending}>
        {createAnnouncement.isPending ? 'Publicando...' : 'Publicar anuncio'}
      </button>
    </form>
  )
}
