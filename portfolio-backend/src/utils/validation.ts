/* eslint-disable @typescript-eslint/no-explicit-any */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true, message: 'Password is valid' };
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Supports formats: +880-1234567890, +880 1234567890, 01234567890, etc.
  const phoneRegex = /^(\+?88)?0?1[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateStringLength = (
  str: string,
  min: number,
  max: number,
  fieldName: string
): { valid: boolean; message: string } => {
  if (str.length < min) {
    return {
      valid: false,
      message: `${fieldName} must be at least ${min} characters long`,
    };
  }
  if (str.length > max) {
    return {
      valid: false,
      message: `${fieldName} must not exceed ${max} characters`,
    };
  }
  return { valid: true, message: `${fieldName} is valid` };
};

export const validateArrayNotEmpty = (
  arr: any[],
  fieldName: string
): { valid: boolean; message: string } => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return {
      valid: false,
      message: `${fieldName} must contain at least one item`,
    };
  }
  return { valid: true, message: `${fieldName} is valid` };
};

export const validateDate = (date: string | Date): boolean => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

export const validateEnum = <T>(
  value: string,
  enumValues: T[],
  fieldName: string
): { valid: boolean; message: string } => {
  if (!enumValues.includes(value as any)) {
    return {
      valid: false,
      message: `${fieldName} must be one of: ${enumValues.join(', ')}`,
    };
  }
  return { valid: true, message: `${fieldName} is valid` };
};

export const validateNumber = (
  value: number,
  min?: number,
  max?: number,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  fieldName: string = 'Value'
): { valid: boolean; message: string } => {
  if (isNaN(value)) {
    return { valid: false, message: `${fieldName} must be a number` };
  }
  if (min !== undefined && value < min) {
    return { valid: false, message: `${fieldName} must be at least ${min}` };
  }
  if (max !== undefined && value > max) {
    return { valid: false, message: `${fieldName} must not exceed ${max}` };
  }
  return { valid: true, message: `${fieldName} is valid` };
};