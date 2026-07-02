import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateItem } from '../hooks/useInventoryMutations'
import styles from './AddItemForm.module.css'

const itemSchema = z.object({
  name: z.string().min(1, 'Requerido'),
  category: z.string().optional(),
  quantity: z.coerce.number().int().min(0, 'Debe ser 0 o más'),
  min_stock_alert: z.coerce.number().int().min(0, 'Debe ser 0 o más'),
})

type ItemFormInput = z.input<typeof itemSchema>
type ItemFormOutput = z.output<typeof itemSchema>

function blockNegativeKey(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === '-' || e.key === 'e') e.preventDefault()
}

export function AddItemForm() {
  const createItem = useCreateItem()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ItemFormInput, unknown, ItemFormOutput>({
    resolver: zodResolver(itemSchema),
    defaultValues: { quantity: 0, min_stock_alert: 5 },
  })

  function onSubmit(data: ItemFormOutput) {
    createItem.mutate(
      { ...data, category: data.category ?? '' },
      { onSuccess: () => reset() }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formHeader}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        <span>Nuevo item</span>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>Nombre</label>
          <input className={styles.input} placeholder="Mancuernas 5kg" {...register('name')} />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Categoría</label>
          <input className={styles.input} placeholder="Pesas" {...register('category')} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Cantidad</label>
          <input type="number" min="0" className={`${styles.input} ${styles.inputSm}`} onKeyDown={blockNegativeKey} {...register('quantity')} />
          {errors.quantity && <span className={styles.error}>{errors.quantity.message}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Alerta</label>
          <input type="number" min="0" className={`${styles.input} ${styles.inputSm}`} onKeyDown={blockNegativeKey} {...register('min_stock_alert')} />
          {errors.min_stock_alert && <span className={styles.error}>{errors.min_stock_alert.message}</span>}
        </div>
        <button type="submit" className={styles.submitBtn} disabled={createItem.isPending}>
          {createItem.isPending ? '...' : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          )}
        </button>
      </div>
    </form>
  )
}
