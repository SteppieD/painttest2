"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calculator, FileText, User, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/get-quote', icon: Calculator, label: 'Create' },
    { href: '/calculator', icon: FileText, label: 'Tools' },
    { href: '/dashboard', icon: User, label: 'Account' },
    { href: '/more', icon: MoreHorizontal, label: 'More' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              <div className="relative">
                <item.icon 
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isActive ? "text-primary-600" : "text-gray-500"
                  )}
                />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-1 -right-1 w-2 h-2 bg-primary-600 rounded-full"
                    transition={{ type: "spring", damping: 20 }}
                  />
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-1 transition-colors",
                  isActive ? "text-primary-600 font-medium" : "text-gray-500"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      
      {/* Add styles for safe area on devices with home indicator */}
      <style jsx global>{`
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </nav>
  )
}