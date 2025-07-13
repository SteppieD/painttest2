import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility functions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  // Handle NaN, undefined, or null values
  if (!amount || isNaN(amount)) {
    return '$0'
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function generateQuoteId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `QUOTE-${timestamp}-${randomStr}`.toUpperCase()
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function calculateSquareFootage(length: number, width: number): number {
  return Math.round(length * width)
}

export function calculateRoomArea(rooms: Array<{ length: number; width: number; height: number }>): number {
  return rooms.reduce((total, room) => {
    const wallArea = 2 * (room.length + room.width) * room.height
    return total + wallArea
  }, 0)
}

export function validateAccessCode(code: string): boolean {
  return /^[A-Z0-9]{6,12}$/.test(code.toUpperCase())
}