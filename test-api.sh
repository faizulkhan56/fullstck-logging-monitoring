#!/bin/bash

# API Test Script for User List Management System

echo "🧪 Testing User List Management API..."
echo "====================================="

API_URL="http://localhost:3001"

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    
    echo "Testing $method $endpoint..."
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X $method "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "%{http_code}" "$API_URL$endpoint")
    fi
    
    status_code="${response: -3}"
    body="${response%???}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo "✅ $method $endpoint - Status: $status_code"
        if [ -n "$body" ] && [ "$body" != "null" ]; then
            echo "   Response: $body"
        fi
    else
        echo "❌ $method $endpoint - Expected: $expected_status, Got: $status_code"
        if [ -n "$body" ]; then
            echo "   Response: $body"
        fi
    fi
    echo ""
}

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s "$API_URL/health" > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    echo "   Attempt $i/30..."
    sleep 2
done

# Test health endpoint
test_endpoint "GET" "/health" "" "200"

# Test get all users (should be empty initially)
test_endpoint "GET" "/api/users" "" "200"

# Test create user
test_endpoint "POST" "/api/users" '{"name":"John Doe","mobile":"1234567890"}' "201"

# Test create another user
test_endpoint "POST" "/api/users" '{"name":"Jane Smith","mobile":"0987654321"}' "201"

# Test get all users (should have 2 users now)
test_endpoint "GET" "/api/users" "" "200"

# Test get user by ID
test_endpoint "GET" "/api/users/1" "" "200"

# Test update user
test_endpoint "PUT" "/api/users/1" '{"name":"John Updated","mobile":"1111111111"}' "200"

# Test delete user
test_endpoint "DELETE" "/api/users/2" "" "204"

# Test get all users (should have 1 user now)
test_endpoint "GET" "/api/users" "" "200"

# Test invalid endpoints
test_endpoint "GET" "/api/users/999" "" "404"
test_endpoint "POST" "/api/users" '{"name":"","mobile":""}' "400"

echo "🎉 API testing completed!"
echo ""
echo "💡 Check the monitoring dashboards:"
echo "   Grafana: http://localhost:3001"
echo "   Jaeger:  http://localhost:16686"
echo "   Prometheus: http://localhost:9090"
