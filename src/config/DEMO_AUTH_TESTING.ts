/**
 * DEMO AUTH MODE - Testing Guide
 * ==============================
 * 
 * This file contains test scenarios for the DEMO LOGIN functionality.
 * 
 * QUICK START:
 * 1. DEMO_MODE is enabled by default in src/config/demo.ts
 * 2. Go to Auth page and enter any phone number (e.g., 9876543210)
 * 3. Click "Send OTP"
 * 4. Enter ANY 6-digit code (e.g., 123456, 000000, 999999)
 * 5. Click "Verify & Continue"
 * 6. You'll be logged in without any Supabase calls
 * 7. Profile shows "Demo User" with your phone number
 * 
 * ===============================
 * TEST SCENARIOS
 * ===============================
 * 
 * SCENARIO 1: Basic Demo Login
 * ├─ Phone: 9876543210
 * ├─ OTP: 123456
 * └─ Expected: Login successful, redirect to /home, profile shows phone
 * 
 * SCENARIO 2: Different OTP Codes
 * ├─ Phone: 9999999999
 * ├─ OTP codes (all should work): 000000, 111111, 654321, 999999
 * └─ Expected: All OTPs accepted
 * 
 * SCENARIO 3: Invalid OTP (should fail)
 * ├─ Phone: 8888888888
 * ├─ OTP: 12345 (only 5 digits)
 * └─ Expected: Error "Invalid OTP format. Must be 6 digits."
 * 
 * SCENARIO 4: Invalid OTP Format (should fail)
 * ├─ Phone: 7777777777
 * ├─ OTP: ABCDEF (non-numeric)
 * └─ Expected: Error "Invalid OTP format. Must be 6 digits."
 * 
 * SCENARIO 5: Logout Flow
 * ├─ Login with: 9876543210, OTP: 654321
 * ├─ Navigate to Profile page
 * ├─ Click "Sign Out"
 * └─ Expected: Cleared session, redirect to home, can login again
 * 
 * SCENARIO 6: Session Persistence
 * ├─ Login with demo account
 * ├─ Refresh page
 * └─ Expected: Session may be lost (demo mode doesn't persist across refreshes)
 * 
 * ===============================
 * AUTHENTICATION DETAILS
 * ===============================
 * 
 * When Demo Mode is Active:
 * 
 * User Object Created:
 * {
 *   id: "9876543210",
 *   email: "9876543210@smartbasket.app",
 *   phone: "9876543210",
 *   user_metadata: {
 *     phone: "9876543210",
 *     name: "Demo User"
 *   },
 *   app_metadata: {
 *     provider: "demo",
 *     providers: ["demo"]
 *   }
 * }
 * 
 * Profile Object Created:
 * {
 *   id: "9876543210",
 *   phone: "9876543210",
 *   name: "Demo User",
 *   city: null,
 *   pin_code: null,
 *   address: null
 * }
 * 
 * Session Object Created:
 * {
 *   access_token: "demo_access_token",
 *   expires_in: 3600,
 *   token_type: "bearer",
 *   user: { ... mock user object ... }
 * }
 * 
 * ===============================
 * DISABLING DEMO MODE
 * ===============================
 * 
 * To switch to PRODUCTION mode:
 * 
 * File: src/config/demo.ts
 * Change: export const DEMO_MODE = true;
 * To:     export const DEMO_MODE = false;
 * 
 * Then external OTP service will be used (Supabase).
 * 
 * ===============================
 * LOGGING
 * ===============================
 * 
 * All demo auth operations are logged to browser console:
 * - [DEMO AUTH] OTP requested for phone: 9876543210
 * - [DEMO AUTH] OTP verified for phone: 9876543210
 * - [DEMO AUTH] Mock session created: { user, profile }
 * - [DEMO AUTH] Logging out from demo session
 * 
 * Check browser DevTools console to see detailed logs.
 * 
 */

export const DEMO_AUTH_TEST_GUIDE = true;
