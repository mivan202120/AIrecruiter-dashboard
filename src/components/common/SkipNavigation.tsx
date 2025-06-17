import { FC } from 'react'

interface SkipNavLink {
  href: string
  label: string
}

interface SkipNavigationProps {
  links?: SkipNavLink[]
}

export const SkipNavigation: FC<SkipNavigationProps> = ({ 
  links = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' },
  ]
}) => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="absolute top-0 left-0 z-50 bg-primary-600 text-white px-4 py-2 m-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}