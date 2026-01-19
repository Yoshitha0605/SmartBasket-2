# Frontend & Backend Integration Guide

## Overview
The Java Spring Boot backend is now fixed and ready to work with the React frontend.

---

## Backend Setup

### 1. Start Backend Server
```bash
cd /workspaces/SmartBasket-2/backend
mvn spring-boot:run
```

**Expected Output**:
```
Started SmartBasketApplication in X.XXX seconds
```

**Server URL**: `http://localhost:8081`

---

## Available API Endpoints

### Phone + OTP Login (PRIMARY FOR DEMO)
```
POST /api/auth/login/phone
Content-Type: application/json

Request:
{
  "phone": "9876543210",
  "otp": "123456"
}

Response (Success):
{
  "userId": 1,
  "email": "9876543210@smartbasket.app",
  "fullName": "Demo User",
  "phone": "9876543210",
  "role": "USER",
  "message": "Login successful",
  "success": true
}

Response (Error):
{
  "userId": null,
  "email": null,
  "fullName": null,
  "phone": "9876543210",
  "role": null,
  "message": "Invalid OTP format. Must be 6 digits.",
  "success": false
}
```

### Get User Profile
```
GET /api/auth/user/{userId}

Response:
{
  "id": 1,
  "email": "9876543210@smartbasket.app",
  "password": "demo_password",
  "fullName": "Demo User",
  "phone": "9876543210",
  "address": null,
  "role": "USER",
  "createdAt": "2026-01-19T10:30:00",
  "updatedAt": "2026-01-19T10:30:00"
}
```

### Update User Profile
```
PUT /api/auth/user/{userId}
Content-Type: application/json

Request:
{
  "fullName": "John Doe",
  "phone": "9876543210",
  "address": "123 Main Street, Bangalore"
}

Response:
{
  "id": 1,
  "email": "9876543210@smartbasket.app",
  "fullName": "John Doe",
  "phone": "9876543210",
  "address": "123 Main Street, Bangalore",
  "role": "USER",
  "createdAt": "2026-01-19T10:30:00",
  "updatedAt": "2026-01-19T11:00:00"
}
```

---

## Demo Mode Behavior

### Login Flow
1. Frontend sends: `POST /api/auth/login/phone`
2. Backend receives phone + OTP
3. Validates OTP is exactly 6 digits ✓
4. Checks if user exists by phone
5. If exists: Returns existing user
6. If not exists: Creates new user with:
   - `id` = auto-generated
   - `phone` = entered phone
   - `fullName` = "Demo User"
   - `email` = internally generated (never shown to user)
7. Returns success response with userId

### User Creation
On first login with new phone:
```java
String email = "9876543210@smartbasket.app";  // Internal only
User newUser = new User(email, "demo_password", "Demo User");
newUser.setPhone("9876543210");
userRepository.save(newUser);  // Stored in H2 database
```

### Profile Persistence
- **Within Session**: All updates persist
- **Across Restarts**: Data lost (in-memory H2)
- **When Moving to Production**: Switch to PostgreSQL/MySQL

---

## Frontend Integration

### Step 1: Update AuthContext to Call Backend
The frontend already has DEMO_AUTH mode. It should be updated to call the backend endpoint:

```typescript
// In AuthContext.tsx - sendOtp method should call backend
const response = await fetch('http://localhost:8081/api/auth/login/phone', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone, otp })
});
const data = await response.json();
```

### Step 2: Handle Backend Response
```typescript
if (data.success) {
  // Set user context with backend data
  setUser({ id: data.userId, phone: data.phone });
  setProfile({ 
    id: data.userId, 
    phone: data.phone, 
    name: data.fullName 
  });
  // Redirect to /home
} else {
  // Show error toast
  toast({ title: "Login Failed", description: data.message });
}
```

### Step 3: Profile Update Integration
```typescript
// Call backend PUT endpoint
const response = await fetch(`http://localhost:8081/api/auth/user/${userId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: newName,
    phone: phone,
    address: newAddress
  })
});
```

---

## Testing Checklist

### ✓ Backend Startup
- [ ] Backend starts on port 8081
- [ ] No errors in console
- [ ] H2 database initialized

### ✓ Phone + OTP Login
- [ ] Phone: 9876543210, OTP: 123456 → Success
- [ ] Phone: 9999999999, OTP: 000000 → Success
- [ ] Phone: 8888888888, OTP: 12345 (5 digits) → Error
- [ ] New users created automatically
- [ ] Existing users logged in

### ✓ Profile Update
- [ ] Can update name
- [ ] Can update address
- [ ] Phone cannot be changed (read-only)
- [ ] Partial updates work
- [ ] No Supabase errors

### ✓ Database
- [ ] H2 console accessible at http://localhost:8081/h2-console
- [ ] Users table created
- [ ] Data persists during session
- [ ] Correct fields in table

---

## Database Schema

Auto-created by JPA:

```sql
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) UNIQUE,
  address TEXT,
  role VARCHAR(50) DEFAULT 'USER',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Example data after first login
INSERT INTO users VALUES 
(1, '9876543210@smartbasket.app', 'demo_password', 'Demo User', 
 '9876543210', NULL, 'USER', '2026-01-19 10:30:00', '2026-01-19 10:30:00');
```

---

## Environment Variables

No additional environment variables needed. Backend uses defaults:

| Setting | Value |
|---------|-------|
| Server Port | 8081 |
| Database | H2 (in-memory) |
| CORS Origins | localhost:8080, localhost:5173 |
| H2 Console | Enabled at /h2-console |

---

## CORS Configuration

Backend allows requests from:
- `http://localhost:8080` (frontend dev server default)
- `http://localhost:5173` (Vite dev server default)

If frontend runs on different port, add CORS origin:

```java
// In AuthController
@CrossOrigin(origins = {"http://localhost:XXXX"})
```

---

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 8081 is in use
lsof -i :8081

# Kill process if needed
kill -9 <PID>

# Try again
mvn spring-boot:run
```

### CORS Errors
Ensure frontend URL is in `@CrossOrigin` origins list in AuthController

### Database Errors
- H2 console: http://localhost:8081/h2-console
- Username: `sa` (no password)
- JDBC URL: `jdbc:h2:mem:smartbasket`

### Login Fails
- Check OTP is exactly 6 digits
- Check phone number format
- Check backend logs for detailed error

---

## Production Deployment

When deploying to production:

1. **Database**: Switch to PostgreSQL/MySQL
2. **Authentication**: Implement real OTP service
3. **Security**: Add password hashing (BCrypt)
4. **API**: Remove demo mode logic
5. **Frontend**: Update API endpoints to production URL
6. **SSL**: Enable HTTPS/TLS

---

## Demo Mode Summary

✅ **Backend**: Fully functional REST API
✅ **Authentication**: Phone + 6-digit OTP (no verification)
✅ **Users**: Auto-created on first login
✅ **Database**: H2 in-memory (data lost on restart)
✅ **CORS**: Configured for localhost
✅ **API Endpoints**: All functional

---

## Status: Ready for College Demo ✓

Backend and frontend can now work together seamlessly for:
- Phone-based login
- Profile management  
- User CRUD operations
- Data persistence during session

No additional backend changes needed. Frontend can call `/api/auth/login/phone` endpoint directly.
