import { useState } from 'react'
import { useInventory } from '../hooks/useInventory'
import { useUpdateQuantity, useDeleteItem } from '../hooks/useInventoryMutations'
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog'
import styles from './InventoryList.module.css'

export function InventoryList() {
  const { data: items, isLoading, error } = useInventory()
  const updateQuantity = useUpdateQuantity()
  const deleteItem = useDeleteItem()
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  if (isLoading) {
    return (
      <div className={styles.container}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skelRow}>
            <div className={styles.skeleton} style={{ width: '60%', height: 16 }} />
          </div>
        ))}
      </div>
    )
  }

  if (error || !items) {
    return (
      <div className={styles.emptyState}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Error al cargar inventario
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
        Inventario vacío
      </div>
    )
  }

  return (
    <>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar item"
        message={`¿Eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        }
        onConfirm={() => {
          if (deleteTarget) deleteItem.mutate(deleteTarget.id)
          setDeleteTarget(null)
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className={styles.container}>
        {items.map((item, index) => {
          const isLowStock = item.quantity <= item.min_stock_alert
          return (
            <div
              key={item.id}
              className={`${styles.row} ${isLowStock ? styles.rowLow : ''}`}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className={styles.rowAccent} />
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <span className={styles.name}>{item.name}</span>
                  {isLowStock && (
                    <span className={styles.lowBadge}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Bajo
                    </span>
                  )}
                </div>
                {item.category && <span className={styles.category}>{item.category}</span>}
              </div>

              <div className={styles.controls}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity.mutate({ itemId: item.id, newQuantity: Math.max(0, item.quantity - 1) })}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </button>
                <span className={styles.quantity}>{item.quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity.mutate({ itemId: item.id, newQuantity: item.quantity + 1 })}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
                  title="Eliminar"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
