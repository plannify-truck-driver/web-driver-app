export const getWeek = (date: Date): { from: Date; to: Date } => {
  const monday: Date = new Date(date)
  // For sunday, today.getDay() returns 0
  monday.setDate(date.getDay() === 0 ? date.getDate() - 6 : date.getDate() - date.getDay() + 1)
  const sunday: Date = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { from: monday, to: sunday }
}
