# Java Backend Migration Guide

This document provides the specifications needed to build a Java 17/Spring Boot backend that can replace Lovable Cloud (Supabase) for the SmartBasket application.

## Technology Stack Recommendation

- **Java 17** (LTS)
- **Spring Boot 3.x**
- **Spring Security** (JWT authentication)
- **Spring Data JPA** (PostgreSQL)
- **PostgreSQL 15+**

---

## Database Schema (JPA Entities)

### 1. Product Entity

```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String brand;

    @Column(name = "category_type", nullable = false)
    private String categoryType;

    @Column(name = "main_category", nullable = false)
    private String mainCategory;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductVariant> variants;
}
```

### 2. ProductVariant Entity

```java
@Entity
@Table(name = "product_variants")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity_label", nullable = false)
    private String quantityLabel; // e.g., "500g", "1kg", "1L"

    @Column(name = "quantity_multiplier")
    private BigDecimal quantityMultiplier;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL)
    private List<PlatformPrice> platformPrices;
}
```

### 3. Platform Entity

```java
@Entity
@Table(name = "platforms")
public class Platform {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Blinkit, Zepto, Instamart, BigBasket, JioMart

    @Column(name = "website_url", nullable = false)
    private String websiteUrl;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "base_delivery_fee")
    private BigDecimal baseDeliveryFee;

    @Column(name = "free_delivery_threshold")
    private BigDecimal freeDeliveryThreshold;

    @Column(name = "avg_delivery_minutes")
    private Integer avgDeliveryMinutes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
```

### 4. PlatformPrice Entity

```java
@Entity
@Table(name = "platform_prices")
public class PlatformPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @ManyToOne
    @JoinColumn(name = "platform_id", nullable = false)
    private Platform platform;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "in_stock")
    private Boolean inStock = true;

    @Column(name = "delivery_minutes")
    private Integer deliveryMinutes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
```

### 5. User/Profile Entity

```java
@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    private UUID id; // Matches auth user ID

    private String name;
    private String phone;
    private String city;

    @Column(name = "pin_code")
    private String pinCode;

    private String address;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### 6. Order Entity

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String status; // placed, confirmed, out_for_delivery, delivered, cancelled

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "delivery_fee")
    private BigDecimal deliveryFee;

    @Column(name = "grand_total", nullable = false)
    private BigDecimal grandTotal;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "delivery_city")
    private String deliveryCity;

    @Column(name = "delivery_pin_code")
    private String deliveryPinCode;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "delivery_minutes")
    private Integer deliveryMinutes;

    @Column(name = "delivery_estimate")
    private String deliveryEstimate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
}
```

### 7. OrderItem Entity

```java
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_image")
    private String productImage;

    @Column(name = "platform_name", nullable = false)
    private String platformName;

    @Column(name = "platform_price", nullable = false)
    private BigDecimal platformPrice;

    @Column(name = "platform_delivery_fee")
    private BigDecimal platformDeliveryFee;

    private Integer quantity;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
```

---

## REST API Endpoints

### Authentication

```
POST /api/auth/otp/send          - Send OTP to phone/email
POST /api/auth/otp/verify        - Verify OTP and get JWT token
POST /api/auth/refresh           - Refresh JWT token
POST /api/auth/logout            - Invalidate session
```

### Products

```
GET  /api/products               - List products (with search, filters, pagination)
GET  /api/products/{id}          - Get product with variants and platform prices
GET  /api/products/search?q=     - Search products by name/brand
```

### Platforms

```
GET  /api/platforms              - List all platforms
```

### Cart

```
GET  /api/cart                   - Get user's cart items
POST /api/cart                   - Add item to cart
PUT  /api/cart/{id}              - Update cart item quantity
DELETE /api/cart/{id}            - Remove item from cart
DELETE /api/cart                 - Clear cart
```

### Orders

```
GET  /api/orders                 - Get user's order history
GET  /api/orders/{id}            - Get order details with items
POST /api/orders                 - Create new order
PATCH /api/orders/{id}/cancel    - Cancel order (within 5 min)
```

### Profile

```
GET  /api/profile                - Get user profile
PUT  /api/profile                - Update user profile
```

---

## Sample API Response Formats

### Product with Variants and Prices

```json
{
  "id": 1,
  "name": "Toned Milk",
  "brand": "Amul",
  "categoryType": "veg",
  "mainCategory": "Dairy",
  "imageUrl": "https://...",
  "variants": [
    {
      "id": 1,
      "quantityLabel": "500ml",
      "quantityMultiplier": 0.5,
      "basePrice": 28,
      "platformPrices": [
        {
          "platformId": 1,
          "platformName": "Blinkit",
          "price": 27,
          "deliveryMinutes": 12,
          "inStock": true
        },
        {
          "platformId": 2,
          "platformName": "Zepto",
          "price": 29,
          "deliveryMinutes": 10,
          "inStock": true
        }
      ]
    }
  ]
}
```

### Order Response

```json
{
  "id": "uuid",
  "status": "placed",
  "totalPrice": 250.00,
  "deliveryFee": 0.00,
  "grandTotal": 250.00,
  "paymentMethod": "UPI",
  "deliveryCity": "Bengaluru",
  "deliveryAddress": "123 Main St",
  "deliveryMinutes": 15,
  "createdAt": "2026-01-18T10:30:00Z",
  "items": [
    {
      "productId": 1,
      "productName": "Toned Milk",
      "platformName": "Blinkit",
      "platformPrice": 27.00,
      "quantity": 2
    }
  ]
}
```

---

## Frontend Integration Steps

### Step 1: Create API Client

Replace Supabase client with a custom API client:

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  // ... put, delete, patch methods
};
```

### Step 2: Update Hooks

Replace Supabase queries in hooks like `useOrders.ts`, `useProducts.ts`:

```typescript
// Before (Supabase)
const { data } = await supabase.from('orders').select('*');

// After (Java API)
const data = await api.get<Order[]>('/api/orders');
```

### Step 3: Update Auth Context

Replace Supabase auth with JWT-based auth calling your Java endpoints.

---

## Environment Variables

Add to your `.env` file:

```
VITE_API_BASE_URL=http://localhost:8080
```

For production:
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## Security Considerations

1. **JWT Authentication**: Use short-lived access tokens (15 min) with refresh tokens
2. **CORS**: Configure Spring Security to allow your frontend origin
3. **Rate Limiting**: Implement rate limiting for OTP endpoints
4. **Input Validation**: Use Bean Validation (@Valid) on all DTOs
5. **SQL Injection**: Use parameterized queries (JPA handles this)

---

## Email Notifications

Replicate the edge functions using Spring Boot:

```java
@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderConfirmation(Order order, String email) {
        // HTML email template similar to edge function
    }

    public void sendOrderCancellation(Order order, String email) {
        // Cancellation email
    }

    public void sendOrderStatusUpdate(Order order, String email) {
        // Status update email
    }
}
```

---

## Next Steps

1. Set up Spring Boot project with dependencies
2. Create JPA entities from the schemas above
3. Implement REST controllers
4. Set up JWT authentication
5. Configure CORS for frontend
6. Update frontend to use new API client
7. Test all flows end-to-end
