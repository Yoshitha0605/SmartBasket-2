# SmartBasket Backend

Spring Boot REST API backend with authentication, products, cart, and orders management.

## Technology Stack

- **Java**: 17
- **Framework**: Spring Boot 3.2.1
- **Database**: H2 (in-memory, development)
- **ORM**: Spring Data JPA
- **Build**: Maven
- **Port**: 8081

## Features

✅ User Authentication (Login/Register)
✅ Product Management (Browse, Search, Filter)
✅ Shopping Cart (Add, Update, Remove, Clear)
✅ Order Management (Create, Track, Update Status)
✅ CORS enabled for frontend (http://localhost:8080 and http://localhost:5173)
✅ H2 Console for database inspection
✅ No external database setup required

## Project Structure

```
backend/
├── src/main/java/com/smartbasket/
│   ├── SmartBasketApplication.java          # Main entry point
│   ├── config/CorsConfig.java               # CORS configuration
│   ├── controller/
│   │   ├── AuthController.java              # Authentication endpoints
│   │   ├── ProductController.java           # Product endpoints
│   │   ├── CartController.java              # Cart endpoints
│   │   └── OrderController.java             # Order endpoints
│   ├── service/
│   │   ├── AuthService.java                 # Auth logic
│   │   ├── ProductService.java              # Product logic
│   │   ├── CartService.java                 # Cart logic
│   │   └── OrderService.java                # Order logic
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ProductRepository.java
│   │   ├── CartItemRepository.java
│   │   └── OrderRepository.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Product.java
│   │   ├── CartItem.java
│   │   └── Order.java
│   └── dto/
│       ├── AuthRequest.java
│       ├── AuthResponse.java
│       ├── CartItemRequest.java
│       ├── CartItemResponse.java
│       └── OrderRequest.java
└── resources/
    └── application.properties
```

## Entities

### User
- `id`, `email`, `password`, `fullName`, `phone`, `address`, `role`
- Timestamps: `createdAt`, `updatedAt`

### Product
- `id`, `name`, `category`, `brand`, `description`, `price`, `imageUrl`, `stock`

### CartItem
- `id`, `userId`, `productId`, `quantity`, `price`
- Relationship: User → CartItem (one-to-many)

### Order
- `id`, `userId`, `totalAmount`, `status`, `shippingAddress`, `paymentMethod`
- Timestamps: `createdAt`, `updatedAt`

## REST API Endpoints

### Authentication

```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/user/{userId}     # Get user profile
PUT    /api/auth/user/{userId}     # Update user profile
```

### Products

```
GET    /api/products               # Get all products
GET    /api/products?category=X    # Filter by category
GET    /api/products?brand=X       # Filter by brand
GET    /api/products?search=X      # Search by name
GET    /api/products/{id}          # Get product by ID
```

### Cart

```
GET    /api/cart/{userId}                           # Get user's cart
POST   /api/cart/{userId}/add                       # Add item to cart
PUT    /api/cart/{userId}/update/{cartItemId}       # Update cart item
DELETE /api/cart/{userId}/remove/{cartItemId}       # Remove from cart
DELETE /api/cart/{userId}/clear                     # Clear entire cart
```

### Orders

```
GET    /api/orders/user/{userId}           # Get user's orders
GET    /api/orders/{orderId}                # Get order details
POST   /api/orders/{userId}/create          # Create new order
PUT    /api/orders/{orderId}/status         # Update order status
```

## Getting Started

### Prerequisites

- Java 17 JDK
- Maven 3.9+

### Build

```bash
cd backend
mvn clean install
```

### Run

```bash
mvn spring-boot:run
```

Server will start on: **http://localhost:8081**

### Access H2 Console

```
URL: http://localhost:8081/h2-console
JDBC URL: jdbc:h2:mem:smartbasket
Username: sa
Password: (leave blank)
```

## API Examples

### Register User

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

Response:
```json
{
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "USER",
  "message": "Registration successful",
  "success": true
}
```

### Login

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get All Products

```bash
curl http://localhost:8081/api/products
```

### Add to Cart

```bash
curl -X POST http://localhost:8081/api/cart/1/add \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### Create Order

```bash
curl -X POST http://localhost:8081/api/orders/1/create \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": "123 Main St, City",
    "paymentMethod": "CARD"
  }'
```

## CORS Configuration

Enabled for:
- `http://localhost:8080` (Frontend port)
- `http://localhost:5173` (Vite default)

Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

## Database

H2 in-memory database:
- Auto-created on startup
- Cleared on application restart
- Console available at `/h2-console`

### Viewing Tables

1. Start the application
2. Visit http://localhost:8081/h2-console
3. Tables: `users`, `products`, `cart_items`, `orders`

## Development Notes

### Port Configuration

To change server port, edit `application.properties`:
```properties
server.port=8082
```

### Database Persistence

For persistent H2 database, change in `application.properties`:
```properties
spring.datasource.url=jdbc:h2:file:./smartbasket
```

### Logging Levels

Adjust in `application.properties`:
```properties
logging.level.com.smartbasket=DEBUG
logging.level.root=INFO
```

## Common Issues

### Port Already in Use

Change port in `application.properties`:
```properties
server.port=8082
```

### Build Fails

Clean and rebuild:
```bash
mvn clean install -DskipTests
```

### Tables Not Visible in H2

Restart the application. H2 is in-memory, so it's cleared on each restart.

## Security Note

⚠️ Current implementation uses plain text passwords for development only.

For production:
1. Add Spring Security
2. Implement password hashing (BCrypt)
3. Add JWT token authentication
4. Add input validation

## Next Steps

- [ ] Implement password hashing
- [ ] Add JWT authentication
- [ ] Add input validation
- [ ] Write unit tests
- [ ] Add API documentation (Swagger)
- [ ] Switch to PostgreSQL for production
- [ ] Add payment integration
- [ ] Add email notifications

## License

This project is part of the SmartBasket initiative.
