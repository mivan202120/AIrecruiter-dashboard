export const parseDate = (dateString: string): Date => {
  // Handle undefined, null, or empty strings
  if (!dateString || dateString.trim() === '') {
    console.error('Empty or undefined date string provided')
    return new Date() // Return current date as fallback
  }

  try {
    // Handle format with no space between time and am/pm (e.g., "11:45am")
    let normalizedDateString = dateString.trim()
    
    // Add space before am/pm if missing
    normalizedDateString = normalizedDateString.replace(/(\d{1,2}:\d{2})(am|pm)/i, '$1 $2')
    
    // Expected format: "d/m/yyyy h:mm am/pm"
    const parts = normalizedDateString.split(' ')
    
    if (parts.length < 3) {
      console.error('Invalid date format:', dateString)
      return new Date(dateString) // Try native parsing as fallback
    }

    const [datePart, timePart, period] = parts
    
    if (!datePart || !timePart || !period) {
      console.error('Missing date components:', { datePart, timePart, period })
      return new Date(dateString) // Try native parsing as fallback
    }

    const dateParts = datePart.split('/')
    if (dateParts.length !== 3) {
      console.error('Invalid date part format:', datePart)
      return new Date(dateString) // Try native parsing as fallback
    }

    const [day, month, year] = dateParts.map(Number)
    
    const timeParts = timePart.split(':')
    if (timeParts.length !== 2) {
      console.error('Invalid time part format:', timePart)
      return new Date(dateString) // Try native parsing as fallback
    }

    let [hours, minutes] = timeParts.map(Number)

    // Handle AM/PM
    const lowerPeriod = period.toLowerCase()
    if (lowerPeriod === 'pm' && hours !== 12) {
      hours += 12
    } else if (lowerPeriod === 'am' && hours === 12) {
      hours = 0
    }

    // Validate parsed values
    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
      console.error('Invalid numeric values in date:', { day, month, year, hours, minutes })
      return new Date(dateString) // Try native parsing as fallback
    }

    return new Date(year, month - 1, day, hours, minutes)
  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    // Try native Date parsing as last resort
    const fallbackDate = new Date(dateString)
    return isNaN(fallbackDate.getTime()) ? new Date() : fallbackDate
  }
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

export const formatDate = (date: Date | string): string => {
  try {
    // Handle both Date objects and date strings
    const dateObj = date instanceof Date ? date : new Date(date)
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date value:', date)
      return '—'
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', date, error)
    return '—'
  }
}

// Utility to ensure a value is a Date object
export const ensureDate = (date: Date | string | any): Date => {
  if (date instanceof Date) {
    return date
  }
  
  // Try to create a Date from the value
  const dateObj = new Date(date)
  
  // If invalid, return current date as fallback
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date, using current date as fallback:', date)
    return new Date()
  }
  
  return dateObj
}
