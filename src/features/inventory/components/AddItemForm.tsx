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
  if (e.key === '-' || e.key === 'e') {
    e.preventDefault()
  }
}

export function AddItemForm() {
  const createItem = useCreateItem()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormInput, unknown, ItemFormOutput>({
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
      <div className={styles.field}>
        <label className={styles.label}>Nombre</label>
        <input className={styles.input} placeholder="Mancuernas 5kg" {...register('name')} />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Categoría</label>
        <input className={styles.input} placeholder="Pesas" {...register('category')} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Cantidad</label>
        <input
          type="number"
          min="0"
          className={`${styles.input} ${styles.inputSmall}`}
          onKeyDown={blockNegativeKey}
          {...register('quantity')}
        />
        {errors.quantity && <span className={styles.error}>{errors.quantity.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Alerta mínima</label>
        <input
          type="number"
          min="0"
          className={`${styles.input} ${styles.inputSmall}`}
          onKeyDown={blockNegativeKey}
          {...register('min_stock_alert')}
        />
        {errors.min_stock_alert && <span className={styles.error}>{errors.min_stock_alert.message}</span>}
      </div>

      <button type="submit" className={styles.submitButton} disabled={createItem.isPending}>
        {createItem.isPending ? 'Agregando...' : 'Agregar item'}
      </button>
    </form>
  )
}