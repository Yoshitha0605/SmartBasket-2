#!/bin/bash

echo "=========================================="
echo "SmartBasket Backend - Integration Tests"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API="http://localhost:8081"

echo -e "${YELLOW}Test 1: Phone + OTP Login (First Time)${NC}"
echo "POST $API/api/auth/login/phone"
echo 'Payload: {"phone":"9876543210","otp":"123456"}'
echo ""
RESPONSE=$(curl -s -X POST $API/api/auth/login/phone \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"123456"}')
echo "Response:"
echo "$RESPONSE" | python3 -m json.tool
USER_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('userId', ''))" 2>/dev/null)
echo ""

if [ -z "$USER_ID" ]; then
    echo -e "${RED}❌ Login failed - no userId in response${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Login successful - User ID: $USER_ID${NC}"
fi
echo ""

echo -e "${YELLOW}Test 2: Phone + OTP Login (Second Time - Should Get Same User)${NC}"
echo "POST $API/api/auth/login/phone"
echo 'Payload: {"phone":"9876543210","otp":"654321"}'
echo ""
RESPONSE2=$(curl -s -X POST $API/api/auth/login/phone \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"654321"}')
echo "Response:"
echo "$RESPONSE2" | python3 -m json.tool
USER_ID_2=$(echo "$RESPONSE2" | python3 -c "import sys, json; print(json.load(sys.stdin).get('userId', ''))" 2>/dev/null)
echo ""

if [ "$USER_ID" = "$USER_ID_2" ]; then
    echo -e "${GREEN}✅ Same user returned on second login${NC}"
else
    echo -e "${RED}❌ Different user ID on second login${NC}"
fi
echo ""

echo -e "${YELLOW}Test 3: Get User Profile${NC}"
echo "GET $API/api/auth/user/$USER_ID"
echo ""
PROFILE=$(curl -s -X GET $API/api/auth/user/$USER_ID)
echo "Response:"
echo "$PROFILE" | python3 -m json.tool
PHONE=$(echo "$PROFILE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('phone', ''))" 2>/dev/null)
echo ""

if [ "$PHONE" = "9876543210" ]; then
    echo -e "${GREEN}✅ Phone number correctly stored: $PHONE${NC}"
else
    echo -e "${RED}❌ Phone number not found or incorrect${NC}"
fi
echo ""

echo -e "${YELLOW}Test 4: Update Profile${NC}"
echo "PUT $API/api/auth/user/$USER_ID"
echo 'Payload: {"fullName":"John Doe","address":"123 Main St"}'
echo ""
UPDATE=$(curl -s -X PUT $API/api/auth/user/$USER_ID \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","address":"123 Main St"}')
echo "Response:"
echo "$UPDATE" | python3 -m json.tool
UPDATE_NAME=$(echo "$UPDATE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('fullName', ''))" 2>/dev/null)
echo ""

if [ "$UPDATE_NAME" = "John Doe" ]; then
    echo -e "${GREEN}✅ Profile updated successfully${NC}"
else
    echo -e "${RED}❌ Profile update failed${NC}"
fi
echo ""

echo -e "${YELLOW}Test 5: Create Different Phone User${NC}"
echo "POST $API/api/auth/login/phone"
echo 'Payload: {"phone":"9123456789","otp":"111111"}'
echo ""
RESPONSE3=$(curl -s -X POST $API/api/auth/login/phone \
  -H "Content-Type: application/json" \
  -d '{"phone":"9123456789","otp":"111111"}')
echo "Response:"
echo "$RESPONSE3" | python3 -m json.tool
USER_ID_3=$(echo "$RESPONSE3" | python3 -c "import sys, json; print(json.load(sys.stdin).get('userId', ''))" 2>/dev/null)
PHONE_3=$(echo "$RESPONSE3" | python3 -c "import sys, json; print(json.load(sys.stdin).get('phone', ''))" 2>/dev/null)
echo ""

if [ "$PHONE_3" = "9123456789" ] && [ "$USER_ID_3" != "$USER_ID" ]; then
    echo -e "${GREEN}✅ New user created with different phone${NC}"
else
    echo -e "${RED}❌ Failed to create new user${NC}"
fi
echo ""

echo -e "${YELLOW}Test 6: Invalid OTP (Not 6 Digits)${NC}"
echo "POST $API/api/auth/login/phone"
echo 'Payload: {"phone":"9876543210","otp":"12345"}'
echo ""
INVALID=$(curl -s -X POST $API/api/auth/login/phone \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"12345"}')
echo "Response:"
echo "$INVALID" | python3 -m json.tool
ERROR=$(echo "$INVALID" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('message', ''))" 2>/dev/null)
echo ""

if [[ "$ERROR" == *"Invalid OTP"* ]] || [[ "$ERROR" == *"6 digits"* ]]; then
    echo -e "${GREEN}✅ Invalid OTP correctly rejected${NC}"
else
    echo -e "${YELLOW}⚠️ Error handling may need review${NC}"
fi
echo ""

echo "=========================================="
echo "✅ All tests completed!"
echo "=========================================="
