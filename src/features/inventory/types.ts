export interface InventoryItem {
  id: string
  name: string
  category: string | null
  quantity: number
  min_stock_alert: number
  updated_at: string
}

export interface NewInventoryItem {
  name: string
  category: string
  quantity: number
  min_stock_alert: number
}