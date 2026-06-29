export function getDaysUntilDue(nextDueDate: string): number {
  const today = new Date()
  const dueDate = new Date(nextDueDate)
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)

  const diffMs = dueDate.getTime() - today.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}