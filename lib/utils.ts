import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function calculatePaintCoverage(squareFeet: number, coats: number = 2): number {
  // Average paint covers 350-400 sq ft per gallon
  const coveragePerGallon = 375
  return Math.ceil((squareFeet * coats) / coveragePerGallon)
}

export function calculateLaborHours(squareFeet: number, complexity: 'simple' | 'moderate' | 'complex' = 'moderate'): number {
  const hoursPerSqFt = {
    simple: 0.008,
    moderate: 0.012,
    complex: 0.018
  }
  return Math.ceil(squareFeet * hoursPerSqFt[complexity])
}

export function generateAccessCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const numbers = '23456789'
  let code = ''
  
  // Format: XXX-NNNN
  for (let i = 0; i < 3; i++) {
    code += letters[Math.floor(Math.random() * letters.length)]
  }
  code += '-'
  for (let i = 0; i < 4; i++) {
    code += numbers[Math.floor(Math.random() * numbers.length)]
  }
  
  return code
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}