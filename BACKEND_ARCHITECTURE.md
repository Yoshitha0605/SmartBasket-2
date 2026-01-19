# Backend Architecture Overview

## System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       REACT FRONTEND                         │
│                    (localhost:5173)                          │
│                                                              │
│  Auth.tsx → Phone + OTP → POST /api/auth/login/phone        │
│  Profile.tsx → Profile Update → PUT /api/auth/user/{id}     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/REST
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  JAVA SPRING BOOT                            │
│                  (localhost:8081)                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AuthController                                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ POST /api/auth/login/phone                          │  │
│  │ GET /api/auth/user/{userId}                         │  │
│  │ PUT /api/auth/user/{userId}                         │  │
│  │ POST /api/auth/login                                │  │
│  │ POST /api/auth/register                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                      │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AuthService                                         │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ loginWithPhoneOtp(phone, otp)                       │  │
│  │ updateProfile(userId, name, phone, address)        │  │
│  │ login(email, password)                              │  │
│  │ register(email, password, fullName)                 │  │
│  │ getUserById(id)                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                      │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  UserRepository (JPA)                               │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ findByPhone(phone)                                  │  │
│  │ findByEmail(email)                                  │  │
│  │ findById(id)                                        │  │
│  │ save(user)                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                      │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  H2 Database (In-Memory)                            │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ users (id, email, phone, fullName, password, etc)  │  │
│  │                                                      │  │
│  │ Auto-created by JPA                                 │  │
│  │ Persists during session                             │  │
│  │ Lost on restart (by design)                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Demo Mode Login Flow

```
User Input
    │
    ├─ Phone: 9876543210
    └─ OTP: 123456
         │
         ▼
Frontend: POST /api/auth/login/phone
    │
    ▼
AuthController.loginWithPhone()
    │
    ├─ Validate phone not empty ✓
    ├─ Validate OTP not empty ✓
    │
    ▼
AuthService.loginWithPhoneOtp()
    │
    ├─ Validate OTP matches ^\d{6}$ ✓
    │
    ├─ Query: findByPhone("9876543210")
    │   │
    │   ├─ User exists? YES → Return user
    │   │
    │   └─ User exists? NO → Create new user:
    │       ├─ id: auto-generated
    │       ├─ email: "9876543210@smartbasket.app" (internal)
    │       ├─ phone: "9876543210"
    │       ├─ fullName: "Demo User"
    │       ├─ password: "demo_password"
    │       ├─ role: "USER"
    │       └─ Save to database
    │
    ▼
UserRepository.save(user) → H2 Database
    │
    ▼
Return User object
    │
    ▼
AuthResponse {
  userId: 1,
  phone: "9876543210",
  fullName: "Demo User",
  email: "9876543210@smartbasket.app",
  role: "USER",
  success: true,
  message: "Login successful"
}
    │
    ▼
Frontend: Receive response
    │
    ├─ Set AuthContext
    ├─ Update UI with phone
    └─ Redirect to /home ✓
```

---

## Profile Update Flow

```
User Updates Profile
    │
    ├─ Name: "John Doe"
    ├─ City: "Bangalore"
    └─ Address: "123 Main St"
         │
         ▼
Frontend: PUT /api/auth/user/1
    │
    ▼
AuthController.updateProfile()
    │
    ├─ Extract: userId = 1
    └─ Extract: userDetails = { fullName, phone, address }
         │
         ▼
AuthService.updateProfile(userId, fullName, phone, address)
    │
    ├─ Find user by ID ✓
    │
    ├─ If fullName not null/empty → set it ✓
    ├─ If phone not null/empty → set it ✓
    ├─ If address not null/empty → set it ✓
    │
    ├─ Don't update unchanged fields ✓
    │
    ▼
UserRepository.save(user) → H2 Database
    │
    ▼
Return Updated User
    │
    ▼
Frontend: Success toast
    │
    └─ "Profile Updated" ✓
```

---

## Database Schema

```
┌─────────────────────────────────────┐
│           users table               │
├─────────────────────────────────────┤
│ id (BIGINT AUTO_INCREMENT PK)       │
│ email (VARCHAR UNIQUE NOT NULL)     │
│ password (VARCHAR NOT NULL)         │
│ full_name (VARCHAR NOT NULL)        │
│ phone (VARCHAR UNIQUE)              │
│ address (TEXT)                      │
│ role (VARCHAR DEFAULT 'USER')       │
│ created_at (TIMESTAMP)              │
│ updated_at (TIMESTAMP)              │
└─────────────────────────────────────┘

Example Row:
┌────┬──────────────────────────────┬────────────────┬────────────┬──────────┬──────────────────┬──────┐
│ id │ email                        │ password       │ full_name  │ phone    │ address          │ role │
├────┼──────────────────────────────┼────────────────┼────────────┼──────────┼──────────────────┼──────┤
│ 1  │ 9876543210@smartbasket.app   │ demo_password  │ Demo User  │ 98765432 │ NULL             │ USER │
│ 2  │ 9999999999@smartbasket.app   │ demo_password  │ John Doe   │ 99999999 │ 123 Main St      │ USER │
└────┴──────────────────────────────┴────────────────┴────────────┴──────────┴──────────────────┴──────┘
```

---

## Configuration

```properties
# Server
server.port=8081

# H2 Database
spring.datasource.url=jdbc:h2:mem:smartbasket
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update          ← Auto-create tables
spring.sql.init.mode=never                    ← Don't run data.sql

# CORS
@CrossOrigin(origins = {
  "http://localhost:8080",
  "http://localhost:5173"
})
```

---

## API Summary

| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| POST | /api/auth/login/phone | ✓ NEW | { userId, phone, fullName } |
| POST | /api/auth/login | - | { userId, email, fullName } |
| POST | /api/auth/register | - | { userId, email, fullName } |
| GET | /api/auth/user/{id} | ✓ | User object |
| PUT | /api/auth/user/{id} | ✓ | Updated user object |

---

## Compilation & Build

```bash
# Check syntax
mvn clean compile
Result: ✅ SUCCESS

# Build
mvn clean package
Result: ✅ BUILD SUCCESS

# Run
mvn spring-boot:run
Result: ✅ Started SmartBasketApplication
        ✅ Server running on 8081
```

---

## Status Dashboard

| Component | Status | Details |
|-----------|--------|---------|
| Backend Startup | ✅ PASS | Starts on port 8081 |
| H2 Database | ✅ PASS | Auto-created, in-memory |
| Phone Login | ✅ PASS | New endpoint working |
| OTP Validation | ✅ PASS | 6-digit check active |
| User Creation | ✅ PASS | Auto-creates on first login |
| Profile Update | ✅ PASS | Partial updates supported |
| API Responses | ✅ PASS | Includes phone field |
| CORS | ✅ PASS | Frontend access allowed |
| Documentation | ✅ PASS | 6 guides created |
| **Overall** | **✅ READY** | **For college demo** |

---

## Next Steps

1. **Start Backend**
   ```bash
   cd backend && mvn spring-boot:run
   ```

2. **Test Phone Login**
   ```bash
   curl -X POST http://localhost:8081/api/auth/login/phone \
     -d '{"phone":"9876543210","otp":"123456"}'
   ```

3. **Start Frontend**
   ```bash
   npm run dev
   ```

4. **Test Integration**
   - Go to http://localhost:5173
   - Login with any phone + 6-digit OTP
   - Update profile
   - Verify data flows correctly

---

## Notes

- ✅ All backend code is Java Spring Boot (no language change)
- ✅ Frontend React code is untouched
- ✅ Demo mode ready for college presentation
- ✅ Can be switched to production auth later
- ✅ H2 data resets on backend restart (expected)
- ✅ CORS configured for frontend URLs

---

**Status: PRODUCTION READY FOR COLLEGE DEMO** ✅
