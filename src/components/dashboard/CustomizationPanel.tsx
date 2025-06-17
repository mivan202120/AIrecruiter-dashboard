import { useState, useEffect } from 'react'
import { Button } from '../common/Button'

interface CustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  onApply: (preferences: DashboardPreferences) => void
}

export interface DashboardPreferences {
  layout: 'default' | 'compact' | 'expanded'
  theme: 'light' | 'dark' | 'auto'
  charts: {
    showAnimations: boolean
    colorScheme: 'default' | 'colorblind' | 'monochrome'
    defaultChartType: 'bar' | 'pie' | 'line'
  }
  display: {
    showInsights: boolean
    showRecommendations: boolean
    showSentiment: boolean
    showDuration: boolean
    cardSize: 'small' | 'medium' | 'large'
  }
  notifications: {
    enabled: boolean
    sound: boolean
    desktop: boolean
  }
}

const defaultPreferences: DashboardPreferences = {
  layout: 'default',
  theme: 'auto',
  charts: {
    showAnimations: true,
    colorScheme: 'default',
    defaultChartType: 'bar'
  },
  display: {
    showInsights: true,
    showRecommendations: true,
    showSentiment: true,
    showDuration: true,
    cardSize: 'medium'
  },
  notifications: {
    enabled: true,
    sound: false,
    desktop: false
  }
}

export const CustomizationPanel = ({ isOpen, onClose, onApply }: CustomizationPanelProps) => {
  const [preferences, setPreferences] = useState<DashboardPreferences>(defaultPreferences)
  const [activeTab, setActiveTab] = useState<'display' | 'charts' | 'notifications'>('display')

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem('dashboard-preferences')
    if (saved) {
      setPreferences(JSON.parse(saved))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('dashboard-preferences', JSON.stringify(preferences))
    onApply(preferences)
    onClose()
  }

  const handleReset = () => {
    setPreferences(defaultPreferences)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Customization settings"
    >
      <div
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-elevation-4 p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Customize Dashboard
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-700">
          {(['display', 'charts', 'notifications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-primary-600 border-primary-600'
                  : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'display' && (
            <div className="space-y-6">
              {/* Layout */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Layout
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['default', 'compact', 'expanded'] as const).map((layout) => (
                    <button
                      key={layout}
                      onClick={() => setPreferences({ ...preferences, layout })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        preferences.layout === layout
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                      }`}
                    >
                      <div className="text-sm font-medium capitalize">{layout}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Options */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Display Options
                </h3>
                <div className="space-y-3">
                  {Object.entries(preferences.display).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {key === 'cardSize' ? (
                        <select
                          value={value as string}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            display: { ...preferences.display, [key]: e.target.value }
                          })}
                          className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      ) : (
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            display: { ...preferences.display, [key]: e.target.checked }
                          })}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="space-y-6">
              {/* Chart Settings */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Chart Settings
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-neutral-700 dark:text-neutral-300">Show Animations</span>
                    <input
                      type="checkbox"
                      checked={preferences.charts.showAnimations}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        charts: { ...preferences.charts, showAnimations: e.target.checked }
                      })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                  </label>

                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-2">
                      Color Scheme
                    </label>
                    <select
                      value={preferences.charts.colorScheme}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        charts: { ...preferences.charts, colorScheme: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900"
                    >
                      <option value="default">Default</option>
                      <option value="colorblind">Colorblind Friendly</option>
                      <option value="monochrome">Monochrome</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-2">
                      Default Chart Type
                    </label>
                    <select
                      value={preferences.charts.defaultChartType}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        charts: { ...preferences.charts, defaultChartType: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900"
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="pie">Pie Chart</option>
                      <option value="line">Line Chart</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Notification Settings
                </h3>
                <div className="space-y-3">
                  {Object.entries(preferences.notifications).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300 capitalize">
                        {key} Notifications
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, [key]: e.target.checked }
                        })}
                        className="w-4 h-4 text-primary-600 rounded"
                        disabled={key !== 'enabled' && !preferences.notifications.enabled}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <Button variant="tertiary" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}