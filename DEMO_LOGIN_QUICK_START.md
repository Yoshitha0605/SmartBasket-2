# DEMO LOGIN MODE - Quick Reference

## ⚡ Quick Start (30 seconds)

1. **Go to Auth page**
2. **Enter phone number**: `9876543210` (any number works)
3. **Click "Send OTP"**
4. **Enter any 6-digit code**: `123456` (any 6 digits work)
5. **Click "Verify & Continue"**
6. ✅ **Logged in!** Redirected to /home

## 🔧 Toggle Demo Mode

**File**: `src/config/demo.ts`

```typescript
// DEMO MODE ENABLED (current)
export const DEMO_MODE = true;

// PRODUCTION MODE (switch to this later)
export const DEMO_MODE = false;
```

## 📊 What Happens in Demo Mode

| Step | Demo Behavior |
|------|---|
| Phone Input | ✅ Any phone number accepted |
| Send OTP | ✅ No Supabase call, instant success |
| OTP Entry | ✅ Any 6-digit code accepted |
| Verification | ✅ No database lookup, mock session created |
| Profile | ✅ Shows "Demo User" with your phone number |
| Logout | ✅ Local state cleared, can login again |

## 📱 Test Scenarios

### Scenario 1: Basic Login ✅
```
Phone: 9876543210
OTP:   123456
→ Success, shows "Demo User"
```

### Scenario 2: Different Numbers ✅
```
Phone: 8888888888
OTP:   000000
→ Success, works fine
```

### Scenario 3: Invalid OTP ❌
```
Phone: 7777777777
OTP:   12345 (only 5 digits)
→ Error: "Invalid OTP format. Must be 6 digits."
```

## 🎯 Perfect For

- ✅ College demos/presentations
- ✅ Prototype testing
- ✅ UI/UX demonstrations
- ✅ Feature showcasing without backend
- ✅ Development before OTP service integration

## 📋 Created Mock Objects

When you login, these are created:

### User Object
```javascript
{
  id: "9876543210",           // Your phone number
  email: "9876543210@smartbasket.app",  // Internal only
  phone: "9876543210",
  user_metadata: {
    phone: "9876543210",
    name: "Demo User"
  },
  app_metadata: {
    provider: "demo"
  }
}
```

### Profile Object
```javascript
{
  id: "9876543210",
  phone: "9876543210",
  name: "Demo User",
  city: null,
  pin_code: null,
  address: null
}
```

## 🔍 Debugging

Open browser console (F12 → Console) to see:

```
[DEMO AUTH] OTP requested for phone: 9876543210
[DEMO AUTH] OTP verified for phone: 9876543210
[DEMO AUTH] Mock session created: { ... }
[DEMO AUTH] Logging out from demo session
```

## ⚙️ Technical Details

- **No Supabase calls** in demo mode
- **No OTP service** needed
- **No database** queries
- **Phone as user ID** instead of email
- **Session expires** on page refresh (demo only)
- **Full app access** after login

## 🔄 Switch to Production

When ready to use real authentication:

1. Edit `src/config/demo.ts`
2. Change `DEMO_MODE = true` → `DEMO_MODE = false`
3. Real Supabase OTP will be used
4. Everything else stays the same!

## 📝 Notes

- Demo mode is enabled by default
- Perfect for immediate testing/demos
- Switch to production when OTP service is ready
- All UI components work normally
- Logout functionality works perfectly

---

**Status**: ✅ Ready for college demos!
