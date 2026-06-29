import { supabase } from '../../shared/lib/supabase'
import type { InventoryItem, NewInventoryItem } from './types'

export async function fetchInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw new Error('No se pudo cargar el inventario')
  }

  return data as InventoryItem[]
}

export async function createInventoryItem(item: NewInventoryItem): Promise<void> {
  const { error } = await supabase.from('inventory_items').insert({
    name: item.name,
    category: item.category || null,
    quantity: item.quantity,
    min_stock_alert: item.min_stock_alert,
  })

  if (error) {
    throw new Error('No se pudo crear el item')
  }
}

export async function updateQuantity(itemId: string, newQuantity: number): Promise<void> {
  const { error } = await supabase
    .from('inventory_items')
    .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
    .eq('id', itemId)

  if (error) {
    throw new Error('No se pudo actualizar la cantidad')
  }
}

export async function deleteInventoryItem(itemId: string): Promise<void> {
  const { error } = await supabase.from('inventory_items').delete().eq('id', itemId)

  if (error) {
    throw new Error('No se pudo eliminar el item')
  }
}