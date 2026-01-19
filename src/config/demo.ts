/**
 * DEMO AUTH CONFIGURATION
 * 
 * Enable this for college demos and testing purposes.
 * When enabled:
 * - Any 6-digit code is accepted as OTP
 * - No Supabase verification is performed
 * - Mock user session is created based on phone number
 * - External OTP service will be integrated later
 */

// Set to true to enable demo mode, false for production
export const DEMO_MODE = true;

// Demo mode flag for dev/production builds
export const isDemoAuth = () => {
  // Enable demo mode in development or if explicitly set
  return DEMO_MODE || import.meta.env.DEV;
};
