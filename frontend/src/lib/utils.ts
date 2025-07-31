import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes properly.
 * This utility function uses clsx for conditional class names and tailwind-merge to handle
 * conflicting Tailwind classes.
 * 
 * @param inputs - Class names or conditional class expressions
 * @returns A merged string of class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a currency value with the specified currency symbol and locale.
 * 
 * @param value - The numeric value to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns A formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Formats a date string or Date object into a human-readable format.
 * 
 * @param date - The date to format (string or Date object)
 * @param options - Intl.DateTimeFormatOptions for customizing the format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns A formatted date string
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

/**
 * Truncates a string to the specified length and adds an ellipsis if truncated.
 * 
 * @param str - The string to truncate
 * @param length - The maximum length (default: 100)
 * @returns The truncated string
 */
export function truncateString(str: string, length: number = 100): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Generates a URL-friendly slug from a string.
 * 
 * @param str - The string to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Debounces a function to limit how often it can be called.
 * 
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds (default: 300)
 * @returns A debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}