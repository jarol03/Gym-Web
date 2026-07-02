import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInventoryItem, updateQuantity, deleteInventoryItem } from '../api'
import type { InventoryItem } from '../types'

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
    onMutate: async ({ itemId, newQuantity }) => {
      await queryClient.cancelQueries({ queryKey: ['inventory'] })
      const previous = queryClient.getQueryData<InventoryItem[]>(['inventory'])
      queryClient.setQueryData<InventoryItem[]>(['inventory'], (old) =>
        old?.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['inventory'], context.previous)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  })
}

export function useDeleteItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  })
}