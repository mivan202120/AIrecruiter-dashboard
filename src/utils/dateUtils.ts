export const parseDate = (dateString: string): Date => {
  // Expected format: "d/m/yyyy h:mm am/pm"
  const [datePart, timePart, period] = dateString.split(' ')
  const [day, month, year] = datePart.split('/').map(Number)
  let [hours] = timePart.split(':').map(Number)
  const [, minutes] = timePart.split(':').map(Number)

  if (period.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12
  } else if (period.toLowerCase() === 'am' && hours === 12) {
    hours = 0
  }

  return new Date(year, month - 1, day, hours, minutes)
}

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
