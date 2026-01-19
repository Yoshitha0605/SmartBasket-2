#!/bin/bash
# Backend Testing Script
# Run these commands to test the fixed backend

echo "=== SmartBasket Backend Testing ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Start Backend${NC}"
echo "cd /workspaces/SmartBasket-2/backend"
echo "mvn spring-boot:run"
echo "Wait for: 'Started SmartBasketApplication'"
echo ""

echo -e "${BLUE}2. Test Phone + OTP Login${NC}"
echo 'curl -X POST http://localhost:8081/api/auth/login/phone \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"phone": "9876543210", "otp": "123456"}'"'"
echo ""

echo -e "${BLUE}3. Test Profile Update${NC}"
echo 'curl -X PUT http://localhost:8081/api/auth/user/1 \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"fullName": "John Doe", "phone": "9876543210", "address": "123 Main St"}'"'"
echo ""

echo -e "${BLUE}4. Test Get User Profile${NC}"
echo "curl http://localhost:8081/api/auth/user/1"
echo ""

echo -e "${BLUE}5. View H2 Database Console${NC}"
echo "http://localhost:8081/h2-console"
echo "JDBC URL: jdbc:h2:mem:smartbasket"
echo "Username: sa"
echo "Password: (leave empty)"
echo ""

echo -e "${GREEN}✓ All endpoints ready for testing${NC}"
