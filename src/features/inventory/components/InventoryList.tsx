import { useInventory } from '../hooks/useInventory'
import { useUpdateQuantity, useDeleteItem } from '../hooks/useInventoryMutations'
import styles from './InventoryList.module.css'

export function InventoryList() {
  const { data: items, isLoading, error } = useInventory()
  const updateQuantity = useUpdateQuantity()
  const deleteItem = useDeleteItem()

  if (isLoading) return <p className={styles.loadingText}>Cargando inventario...</p>
  if (error || !items) return <p className={styles.errorText}>No se pudo cargar el inventario</p>

  return (
    <div className={styles.container}>
      {items.map((item) => {
        const isLowStock = item.quantity <= item.min_stock_alert

        return (
          <div key={item.id} className={`${styles.row} ${isLowStock ? styles.rowLowStock : ''}`}>
            <div className={styles.info}>
              <span className={styles.name}>{item.name}</span>
              {item.category && <span className={styles.category}>{item.category}</span>}
              {isLowStock && <span className={styles.lowStockLabel}>Stock bajo</span>}
            </div>

            <div className={styles.controls}>
              <button
                className={styles.qtyButton}
                onClick={() =>
                  updateQuantity.mutate({ itemId: item.id, newQuantity: Math.max(0, item.quantity - 1) })
                }
              >
                −
              </button>
              <span className={styles.quantity}>{item.quantity}</span>
              <button
                className={styles.qtyButton}
                onClick={() => updateQuantity.mutate({ itemId: item.id, newQuantity: item.quantity + 1 })}
              >
                +
              </button>

              <button
                className={styles.deleteButton}
                onClick={() => {
                  if (confirm(`¿Eliminar "${item.name}" del inventario?`)) {
                    deleteItem.mutate(item.id)
                  }
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}