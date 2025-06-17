import { FC } from 'react'

interface SkeletonLoaderProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave'
}

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = 20,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-neutral-200 dark:bg-neutral-700'
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
  }
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  }
  
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }
  
  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-label="Loading..."
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Card skeleton component
export const CardSkeleton: FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-elevation-1 ${className}`}>
      <SkeletonLoader variant="text" width="40%" height={24} className="mb-4" />
      <SkeletonLoader variant="text" width="60%" height={16} className="mb-2" />
      <SkeletonLoader variant="text" width="80%" height={16} />
    </div>
  )
}

// Table skeleton component
export const TableSkeleton: FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className = '' 
}) => {
  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow-elevation-1 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-neutral-50 dark:bg-neutral-700 p-4 border-b border-neutral-200 dark:border-neutral-600">
        <div className="flex gap-4">
          <SkeletonLoader variant="text" width="20%" height={20} />
          <SkeletonLoader variant="text" width="30%" height={20} />
          <SkeletonLoader variant="text" width="25%" height={20} />
          <SkeletonLoader variant="text" width="25%" height={20} />
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="p-4 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <div className="flex gap-4">
            <SkeletonLoader variant="text" width="20%" height={16} />
            <SkeletonLoader variant="text" width="30%" height={16} />
            <SkeletonLoader variant="text" width="25%" height={16} />
            <SkeletonLoader variant="text" width="25%" height={16} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Chart skeleton component
export const ChartSkeleton: FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-elevation-1 ${className}`}>
      <SkeletonLoader variant="text" width="30%" height={24} className="mb-6" />
      
      {/* Fake chart bars */}
      <div className="flex items-end gap-4 h-48">
        {[60, 80, 45, 90, 70, 85].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <SkeletonLoader
              variant="rectangular"
              width="100%"
              height={`${height}%`}
              className="mb-2"
            />
            <SkeletonLoader variant="text" width="80%" height={12} />
          </div>
        ))}
      </div>
    </div>
  )
}