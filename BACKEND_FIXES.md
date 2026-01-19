# Backend Fixes - Java Spring Boot

## Summary of Changes

All backend issues have been fixed. The backend now:
✅ Starts without errors on port 8081
✅ Uses H2 in-memory database with JPA auto schema generation
✅ Supports phone + OTP login (demo mode)
✅ Supports profile updates
✅ No data.sql execution issues

---

## 1. Application Configuration Fixed

**File**: `backend/src/main/resources/application.properties`

**Changes**:
- `spring.jpa.hibernate.ddl-auto=update` (was `create-drop`)
- `spring.sql.init.mode=never` (prevents auto data.sql execution)

**Result**: Tables created on first run, preserved across restarts, no schema conflicts.

---

## 2. User Entity Updated

**File**: `backend/src/main/java/com/smartbasket/entity/User.java`

**Changes**:
- Made `phone` column unique: `@Column(unique = true)`

**Result**: Phone can be used as alternate user identifier.

---

## 3. AuthRequest DTO Enhanced

**File**: `backend/src/main/java/com/smartbasket/dto/AuthRequest.java`

**Changes**:
- Added `phone` field for phone-based login
- Added `otp` field for OTP verification

**Result**: Can accept phone + OTP in login requests.

---

## 4. AuthResponse DTO Enhanced

**File**: `backend/src/main/java/com/smartbasket/dto/AuthResponse.java`

**Changes**:
- Added `phone` field to response
- Added constructor with phone parameter

**Result**: API responses include phone number.

---

## 5. UserRepository Extended

**File**: `backend/src/main/java/com/smartbasket/repository/UserRepository.java`

**Changes**:
- Added `Optional<User> findByPhone(String phone)`
- Added `boolean existsByPhone(String phone)`

**Result**: Can query users by phone number.

---

## 6. AuthService Enhanced

**File**: `backend/src/main/java/com/smartbasket/service/AuthService.java`

**Changes**:
- Added `loginWithPhoneOtp(String phone, String otp)` method
- Validates OTP is 6 digits (any value accepted for demo)
- Creates user if doesn't exist
- Updated `updateProfile()` to handle null/empty fields

**Result**: College demo mode - any 6-digit OTP works, no real authentication required.

---

## 7. AuthController Updated

**File**: `backend/src/main/java/com/smartbasket/controller/AuthController.java`

**Changes**:
- Added `POST /api/auth/login/phone` endpoint
- Accepts `{ "phone": "9876543210", "otp": "123456" }`
- Updated existing endpoints to include phone in responses

**Result**: New phone+OTP login endpoint for demo mode.

---

## How to Test

### Backend Startup
```bash
cd backend
mvn spring-boot:run
```

Expected output:
```
Started SmartBasketApplication in X seconds
```

### Test Phone + OTP Login
```bash
curl -X POST http://localhost:8081/api/auth/login/phone \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "123456"}'
```

Response:
```json
{
  "userId": 1,
  "email": "9876543210@smartbasket.app",
  "fullName": "Demo User",
  "phone": "9876543210",
  "role": "USER",
  "message": "Login successful",
  "success": true
}
```

### Test Profile Update
```bash
curl -X PUT http://localhost:8081/api/auth/user/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St"
  }'
```

### View H2 Console
Open browser: `http://localhost:8081/h2-console`
- JDBC URL: `jdbc:h2:mem:smartbasket`
- Username: `sa`
- Password: (leave empty)

---

## API Endpoints

### Phone + OTP Login (NEW - DEMO MODE)
```
POST /api/auth/login/phone
Request: { "phone": "9876543210", "otp": "123456" }
Response: { userId, email, fullName, phone, role, message, success }
```

### Traditional Login (EXISTING)
```
POST /api/auth/login
Request: { "email": "user@example.com", "password": "pass123" }
Response: { userId, email, fullName, phone, role, message, success }
```

### Get User Profile (EXISTING)
```
GET /api/auth/user/{userId}
Response: User object with all fields
```

### Update Profile (FIXED)
```
PUT /api/auth/user/{userId}
Request: { "fullName": "...", "phone": "...", "address": "..." }
Response: Updated User object
```

---

## Database Schema

Auto-created by JPA on first run:

```sql
CREATE TABLE users (
  id IDENTITY PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) UNIQUE,
  address TEXT,
  role VARCHAR(50) DEFAULT 'USER',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Key Features

✅ **H2 In-Memory Database**
- Fresh database on each startup
- Perfect for college demos
- No external dependencies

✅ **JPA Auto Schema Generation**
- `ddl-auto=update` safely manages schema
- Tables created only if not exist
- Entities stay in sync with database

✅ **Phone + OTP Demo Login**
- Any 6-digit OTP accepted
- No real authentication needed
- Perfect for demo/testing

✅ **Profile Update Works**
- Accepts partial updates
- Preserves unchanged fields
- No Supabase dependency

✅ **No Data.sql Issues**
- `spring.sql.init.mode=never` disables auto-execution
- Manual schema creation by JPA
- No insert-before-schema problems

---

## Notes for Production

When moving to production:
1. Change `spring.jpa.hibernate.ddl-auto=validate`
2. Use real database (PostgreSQL, MySQL, etc.)
3. Add authentication mechanism
4. Remove demo OTP validation
5. Implement proper password hashing
6. Add SSL/HTTPS support

---

## Status

✅ All backend issues fixed
✅ No compilation errors
✅ Ready for college demo
✅ Frontend can call `/api/auth/login/phone` endpoint
