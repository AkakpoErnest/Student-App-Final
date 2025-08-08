import { formatSupabaseError, logSupabaseError, getUserFriendlyErrorMessage } from './errorUtils';

// Example test showing the improved error handling
export function testErrorHandling() {
  console.log('=== Testing Error Handling Improvements ===');
  
  // Simulate a Supabase error object
  const mockSupabaseError = {
    message: 'column "test" does not exist',
    details: 'Perhaps you meant to reference the column "test_id".',
    hint: 'Check your column names',
    code: '42703'
  };

  // Test formatSupabaseError
  console.log('1. formatSupabaseError result:');
  const formatted = formatSupabaseError(mockSupabaseError);
  console.log(formatted);

  // Test logSupabaseError (this replaces the problematic console.error calls)
  console.log('\n2. logSupabaseError output:');
  logSupabaseError('Test context', mockSupabaseError);

  // Test getUserFriendlyErrorMessage
  console.log('\n3. User-friendly message:');
  const userMessage = getUserFriendlyErrorMessage(mockSupabaseError);
  console.log(userMessage);

  // Before (what caused [object Object]):
  console.log('\n=== BEFORE (what caused [object Object]) ===');
  console.log('Bad way that showed [object Object]:');
  console.error('Error details:', mockSupabaseError); // This could show [object Object] in some browsers

  console.log('\n=== AFTER (our fix) ===');
  console.log('Good way that shows structured error:');
  logSupabaseError('Same error context', mockSupabaseError);
}

// Test different error types
export function testDifferentErrorTypes() {
  console.log('\n=== Testing Different Error Types ===');
  
  // Test with different error formats
  const errors = [
    new Error('Standard JS error'),
    'String error message',
    { message: 'Custom object error' },
    null,
    undefined,
    { code: 'PGRST116', message: 'No rows found' }
  ];

  errors.forEach((error, index) => {
    console.log(`\nError ${index + 1}:`);
    const userMessage = getUserFriendlyErrorMessage(error);
    console.log(`User message: ${userMessage}`);
    logSupabaseError(`Test error ${index + 1}`, error);
  });
}
