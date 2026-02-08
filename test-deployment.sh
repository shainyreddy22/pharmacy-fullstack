#!/bin/bash

# Backend Deployment Test Script
# Run this script after deploying to Render to verify everything is working

echo "🧪 Testing Pharmacy Backend Deployment"
echo "======================================"

# Check if URL is provided
if [ -z "$1" ]; then
    echo "Usage: ./test-deployment.sh <render-backend-url>"
    echo "Example: ./test-deployment.sh https://pharmacy-backend-xxxx.onrender.com"
    exit 1
fi

BASE_URL=$1
API_URL="${BASE_URL}/api"

echo "Testing URL: $BASE_URL"
echo ""

# Test 1: Health Check
echo "1. Testing Health Check Endpoint..."
curl -s -f "${BASE_URL}/actuator/health" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
fi
echo ""

# Test 2: Authentication
echo "2. Testing Authentication..."
AUTH_RESPONSE=$(curl -s -X POST "${API_URL}/auth/signin" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')

if echo "$AUTH_RESPONSE" | grep -q "accessToken"; then
    echo "✅ Authentication successful"
    # Extract token for later use
    TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
else
    echo "❌ Authentication failed"
    echo "Response: $AUTH_RESPONSE"
fi
echo ""

# Test 3: Dashboard Summary
echo "3. Testing Dashboard Summary..."
DASHBOARD_RESPONSE=$(curl -s "${API_URL}/dashboard/summary")
if [ $? -eq 0 ] && [ -n "$DASHBOARD_RESPONSE" ]; then
    echo "✅ Dashboard summary accessible"
    echo "Response: $DASHBOARD_RESPONSE"
else
    echo "❌ Dashboard summary failed"
fi
echo ""

# Test 4: Medicines Endpoint
echo "4. Testing Medicines Endpoint..."
MEDICINES_RESPONSE=$(curl -s "${API_URL}/medicines")
if [ $? -eq 0 ]; then
    echo "✅ Medicines endpoint accessible"
else
    echo "❌ Medicines endpoint failed"
fi
echo ""

# Test 5: CORS Headers (if token available)
if [ -n "$TOKEN" ]; then
    echo "5. Testing CORS with Authentication..."
    CORS_TEST=$(curl -s -I -H "Authorization: Bearer $TOKEN" "${API_URL}/dashboard/summary" | grep -i "access-control")
    if [ -n "$CORS_TEST" ]; then
        echo "✅ CORS headers present"
    else
        echo "⚠️  CORS headers not found"
    fi
    echo ""
fi

echo "🎉 Deployment Test Complete!"
echo ""
echo "Next steps:"
echo "1. Update your frontend's VITE_API_URL to: ${API_URL}"
echo "2. Deploy your frontend to Netlify/Vercel"
echo "3. Test the full application flow"