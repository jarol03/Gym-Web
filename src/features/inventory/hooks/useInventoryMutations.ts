import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInventoryItem, updateQuantity, deleteInventoryItem } from '../api'

export function useCreateItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  })
}

export function useUpdateQuantity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, newQuantity }: { itemId: string; newQuantity: number }) =>
      updateQuantity(itemId, newQuantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  })
}

export function useDeleteItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  })
}