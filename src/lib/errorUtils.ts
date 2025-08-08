import { PostgrestError } from '@supabase/supabase-js';

export interface FormattedError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
  originalError?: any;
}

/**
 * Formats Supabase errors for proper display and logging
 */
export function formatSupabaseError(error: PostgrestError | Error | any): FormattedError {
  if (!error) {
    return { message: 'Unknown error occurred' };
  }

  // Handle Supabase PostgrestError
  if (error.message && typeof error === 'object') {
    return {
      message: error.message || 'Database operation failed',
      details: error.details || undefined,
      hint: error.hint || undefined,
      code: error.code || undefined,
      originalError: error
    };
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return {
      message: error.message || 'An error occurred',
      originalError: error
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return { message: error };
  }

  // Handle unknown error types
  return {
    message: 'An unexpected error occurred',
    originalError: error
  };
}

/**
 * Logs Supabase errors with proper formatting to avoid [object Object] display
 */
export function logSupabaseError(context: string, error: any): void {
  const formatted = formatSupabaseError(error);
  
  console.error(`${context}:`, {
    message: formatted.message,
    ...(formatted.details && { details: formatted.details }),
    ...(formatted.hint && { hint: formatted.hint }),
    ...(formatted.code && { code: formatted.code })
  });

  // Also log the raw error for debugging if it's different
  if (formatted.originalError && formatted.originalError !== error) {
    console.error(`${context} (raw):`, formatted.originalError);
  }
}

/**
 * Gets a user-friendly error message from Supabase errors
 */
export function getUserFriendlyErrorMessage(error: any): string {
  const formatted = formatSupabaseError(error);
  
  // Common Supabase error patterns
  if (formatted.code === 'PGRST116') {
    return 'No data found';
  }
  
  if (formatted.code === '23505') {
    return 'This item already exists';
  }
  
  if (formatted.code === '23503') {
    return 'Referenced data not found';
  }
  
  if (formatted.code === '42501') {
    return 'Permission denied';
  }
  
  if (formatted.message?.includes('JWT')) {
    return 'Authentication expired. Please sign in again.';
  }
  
  if (formatted.message?.includes('connection')) {
    return 'Connection failed. Please check your internet connection.';
  }
  
  return formatted.message || 'An unexpected error occurred';
}
