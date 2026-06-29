import { useQuery } from '@tanstack/react-query'
import { fetchInventory } from '../api'

export function useInventory() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  })
}