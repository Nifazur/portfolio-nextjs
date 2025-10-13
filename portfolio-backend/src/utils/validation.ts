// src/utils/validation.ts

/**
 * Validates if a string is a valid email address
 * @param email - The email string to validate
 * @returns true if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param password - The password string to validate
 * @returns Object with valid boolean and message string
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true, message: 'Password is valid' };
};

/**
 * Validates if a string is a valid phone number
 * @param phone - The phone string to validate
 * @returns true if valid, false otherwise
 */
export const validatePhone = (phone: string): boolean => {
  // Supports various formats: +880-1234567890, +8801234567890, 01234567890
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{10,14}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @returns true if valid, false otherwise
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if a string contains only alphanumeric characters
 * @param str - The string to validate
 * @returns true if valid, false otherwise
 */
export const validateAlphanumeric = (str: string): boolean => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(str);
};

/**
 * Validates if a number is within a specified range
 * @param num - The number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns true if valid, false otherwise
 */
export const validateRange = (num: number, min: number, max: number): boolean => {
  return num >= min && num <= max;
};

/**
 * Validates if a string has a minimum and maximum length
 * @param str - The string to validate
 * @param minLength - Minimum length (inclusive)
 * @param maxLength - Maximum length (inclusive)
 * @returns Object with valid boolean and message string
 */
export const validateLength = (
  str: string,
  minLength: number,
  maxLength: number
): { valid: boolean; message: string } => {
  if (str.length < minLength) {
    return { valid: false, message: `Must be at least ${minLength} characters long` };
  }
  if (str.length > maxLength) {
    return { valid: false, message: `Must not exceed ${maxLength} characters` };
  }
  return { valid: true, message: 'Valid length' };
};

/**
 * Sanitizes a string by removing special characters
 * @param str - The string to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (str: string): string => {
  return str.replace(/[<>"'&]/g, '');
};

/**
 * Validates if a value is not empty (not null, undefined, empty string, or empty array)
 * @param value - The value to validate
 * @returns true if not empty, false otherwise
 */
export const isNotEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};