export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    handler: () => void
  }
}

type NotificationListener = (notifications: Notification[]) => void

export class NotificationService {
  private notifications: Notification[] = []
  private listeners: NotificationListener[] = []
  private soundEnabled: boolean = false

  constructor() {
    this.loadSettings()
    this.checkPermissions()
  }

  private loadSettings() {
    const preferences = localStorage.getItem('dashboard-preferences')
    if (preferences) {
      const parsed = JSON.parse(preferences)
      this.soundEnabled = parsed.notifications?.sound || false
    }
  }

  private checkPermissions() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  subscribe(listener: NotificationListener) {
    this.listeners.push(listener)
    // Send current notifications to new listener
    listener(this.notifications)
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications))
  }

  add(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }

    this.notifications.unshift(newNotification)
    this.notifyListeners()

    // Show browser notification if enabled
    this.showBrowserNotification(newNotification)

    // Play sound if enabled
    if (this.soundEnabled) {
      this.playSound(newNotification.type)
    }

    return newNotification
  }

  private showBrowserNotification(notification: Notification) {
    const preferences = localStorage.getItem('dashboard-preferences')
    if (!preferences) return

    const parsed = JSON.parse(preferences)
    if (!parsed.notifications?.desktop) return

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon.png',
        tag: notification.id
      })
    }
  }

  private playSound(type: Notification['type']) {
    // In a real app, you'd have different sounds for different types
    const audio = new Audio('/notification-sound.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {
      // Ignore if sound fails to play
    })
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true)
    this.notifyListeners()
  }

  remove(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId)
    this.notifyListeners()
  }

  clear() {
    this.notifications = []
    this.notifyListeners()
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  // Simulate real-time updates
  startSimulation() {
    const simulatedEvents = [
      {
        type: 'info' as const,
        title: 'New candidate response',
        message: 'John Doe has completed their interview'
      },
      {
        type: 'success' as const,
        title: 'Analysis complete',
        message: 'AI has finished analyzing 5 new interviews'
      },
      {
        type: 'warning' as const,
        title: 'High rejection rate',
        message: 'Rejection rate has increased by 15% today'
      }
    ]

    setInterval(() => {
      const event = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)]
      this.add(event)
    }, 30000) // Every 30 seconds
  }
}