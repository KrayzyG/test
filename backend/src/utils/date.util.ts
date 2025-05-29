import { format, parseISO, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

/**
 * Format a date string
 * @param dateString Date string to format
 * @param formatString Format string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatString: string = 'yyyy-MM-dd'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    return dateString;
  }
};

/**
 * Format a date as a time ago string
 * @param dateString Date string
 * @returns Time ago string
 */
export const formatTimeAgo = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    
    const diffInSeconds = differenceInSeconds(now, date);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = differenceInMinutes(now, date);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = differenceInHours(now, date);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = differenceInDays(now, date);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    return formatDate(dateString);
  } catch (error) {
    return dateString;
  }
};

/**
 * Check if a date is today
 * @param dateString Date string
 * @returns True if date is today, false otherwise
 */
export const isToday = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  } catch (error) {
    return false;
  }
};

/**
 * Get the current date as an ISO string
 * @returns Current date as ISO string
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

/**
 * Add days to a date
 * @param dateString Date string
 * @param days Number of days to add
 * @returns New date as ISO string
 */
export const addDays = (dateString: string, days: number): string => {
  try {
    const date = parseISO(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString();
  } catch (error) {
    return dateString;
  }
};

/**
 * Calculate the difference in days between two dates
 * @param dateString1 First date string
 * @param dateString2 Second date string
 * @returns Difference in days
 */
export const getDaysDifference = (dateString1: string, dateString2: string): number => {
  try {
    const date1 = parseISO(dateString1);
    const date2 = parseISO(dateString2);
    
    return Math.abs(differenceInDays(date1, date2));
  } catch (error) {
    return 0;
  }
};
