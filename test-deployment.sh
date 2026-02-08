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

# Test 1: Basic Health Check
echo "1. Testing Basic Health Check..."
curl -s -f "${BASE_URL}/health" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Basic health check passed"
else
    echo "❌ Basic health check failed"
fi
echo ""

# Test 2: Root Endpoint
echo "2. Testing Root Endpoint..."
ROOT_RESPONSE=$(curl -s "${BASE_URL}/")
if [ $? -eq 0 ] && [ -n "$ROOT_RESPONSE" ]; then
    echo "✅ Root endpoint accessible"
    echo "Response: $ROOT_RESPONSE"
else
    echo "❌ Root endpoint failed"
fi
echo ""

# Test 3: Actuator Health Check
echo "3. Testing Actuator Health Check..."
ACTUATOR_RESPONSE=$(curl -s "${BASE_URL}/actuator/health")
if [ $? -eq 0 ] && echo "$ACTUATOR_RESPONSE" | grep -q "status"; then
    echo "✅ Actuator health check passed"
    echo "Response: $ACTUATOR_RESPONSE"
else
    echo "❌ Actuator health check failed"
    echo "Response: $ACTUATOR_RESPONSE"
fi
echo ""

# Test 4: Authentication
echo "4. Testing Authentication..."
AUTH_RESPONSE=$(curl -s -X POST "${API_URL}/auth/signin" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')

if echo "$AUTH_RESPONSE" | grep -q "accessToken"; then
    echo "✅ Authentication successful"
    # Extract token for later use
    TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    echo "Token: $TOKEN"
else
    echo "❌ Authentication failed"
    echo "Response: $AUTH_RESPONSE"
fi
echo ""

# Test 5: Dashboard Summary (if token available)
if [ -n "$TOKEN" ]; then
    echo "5. Testing Dashboard Summary with Authentication..."
    DASHBOARD_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "${API_URL}/dashboard/summary")
    if [ $? -eq 0 ] && [ -n "$DASHBOARD_RESPONSE" ]; then
        echo "✅ Dashboard summary accessible with authentication"
        echo "Response: $DASHBOARD_RESPONSE"
    else
        echo "❌ Dashboard summary failed with authentication"
    fi
    echo ""
    
    # Test 6: Medicines Endpoint (if token available)
    echo "6. Testing Medicines Endpoint with Authentication..."
    MEDICINES_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "${API_URL}/medicines")
    if [ $? -eq 0 ]; then
        echo "✅ Medicines endpoint accessible with authentication"
    else
        echo "❌ Medicines endpoint failed with authentication"
    fi
    echo ""
    
    # Test 7: CORS Headers
    echo "7. Testing CORS Headers..."
    CORS_TEST=$(curl -s -I -H "Authorization: Bearer $TOKEN" "${API_URL}/dashboard/summary" | grep -i "access-control")
    if [ -n "$CORS_TEST" ]; then
        echo "✅ CORS headers present"
        echo "$CORS_TEST"
    else
        echo "⚠️  CORS headers not found"
    fi
    echo ""
else
    echo "5. Skipping authenticated tests (no token available)"
    echo ""
fi

echo "🎉 Deployment Test Complete!"
echo ""
echo "Next steps:"
echo "1. Update your frontend's VITE_API_URL to: ${API_URL}"
echo "2. Deploy your frontend to Netlify/Vercel"
echo "3. Test the full application flow"
echo ""
echo "If any tests failed, check:"
echo "- Render logs for database connection issues"
echo "- Environment variables in Render dashboard"
echo "- Application.properties configuration"