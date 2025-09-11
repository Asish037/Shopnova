# Authentication System Guide

This guide explains how to use the global authentication system implemented in your React Native app.

## Overview

The authentication system provides:
- Global token management
- Automatic token inclusion in API requests
- User data persistence
- Authentication state management
- Easy-to-use hooks and utilities

## Components

### 1. CartContext (Enhanced)
- Manages user state and authentication tokens
- Provides login/logout functionality
- Handles token persistence

### 2. useAuth Hook
- Custom hook for easy authentication access
- Provides authentication state and methods

### 3. Auth Utilities
- Helper functions for token management
- Authentication checks and data retrieval

### 4. Axios Interceptors
- Automatically adds tokens to API requests
- Handles token expiration (401 responses)

## Usage Examples

### Basic Authentication Check

```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { isAuthenticated, user, token } = useAuth();

  if (!isAuthenticated) {
    return <Text>Please log in</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user?.name}!</Text>
      <Text>Token: {token}</Text>
    </View>
  );
};
```

### Using AuthGuard Component

```javascript
import AuthGuard from '../Components/AuthGuard';

const ProtectedScreen = () => {
  return (
    <AuthGuard>
      <View>
        <Text>This content is only visible to authenticated users</Text>
      </View>
    </AuthGuard>
  );
};
```

### Making Authenticated API Calls

```javascript
import axios from '../Components/axios';

// Token is automatically added to requests
const fetchUserData = async () => {
  try {
    const response = await axios.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

### Manual Token Management

```javascript
import { getAuthToken, getUserData, isAuthenticated } from '../utils/authUtils';

const checkAuth = async () => {
  const token = await getAuthToken();
  const userData = await getUserData();
  const authenticated = await isAuthenticated();
  
  console.log('Token:', token);
  console.log('User:', userData);
  console.log('Authenticated:', authenticated);
};
```

### Login Process (OTP Screen)

```javascript
import { useAuth } from '../hooks/useAuth';

const OtpScreen = () => {
  const { login, setAuthToken } = useAuth();

  const handleOtpVerification = async (otpData) => {
    try {
      const response = await axios.post('/verify-otp', otpData);
      
      if (response.data.token) {
        // Set token globally
        await setAuthToken(response.data.token);
        
        // Set user data globally
        await login(response.data.user, response.data.token);
        
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainHome' }],
        });
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };
};
```

### Logout Process

```javascript
import { useAuth } from '../hooks/useAuth';

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navigate to login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text>Logout</Text>
    </TouchableOpacity>
  );
};
```

## API Response Format

The OTP verification endpoint should return:

```json
{
  "status": 200,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "phone": "+1234567890",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Features

### Automatic Token Management
- Tokens are automatically added to all axios requests
- Token expiration is handled automatically
- Auth data is cleared on 401 responses

### Persistent Storage
- User data and tokens are stored in AsyncStorage
- Data persists across app restarts
- Automatic loading on app startup

### Global State
- Authentication state is available throughout the app
- Easy access via useAuth hook
- Real-time authentication status

### Security
- Tokens are stored securely in AsyncStorage
- Automatic cleanup on logout
- Token validation on API calls

## Best Practices

1. **Always check authentication status** before showing protected content
2. **Use the useAuth hook** for authentication state
3. **Wrap protected screens** with AuthGuard component
4. **Handle token expiration** gracefully
5. **Clear auth data** on logout
6. **Use axios instance** for API calls (automatic token inclusion)

## Troubleshooting

### Token Not Being Added to Requests
- Ensure you're using the axios instance from `../Components/axios`
- Check that the token is properly stored in AsyncStorage

### Authentication State Not Updating
- Make sure components are wrapped with CartProvider
- Use the useAuth hook instead of direct context access

### Token Expiration Issues
- The system automatically handles 401 responses
- Check that your API returns proper 401 status codes
- Ensure logout is called when token expires

## File Structure

```
src/
├── Context/
│   └── CartContext.js          # Enhanced with token management
├── hooks/
│   └── useAuth.js              # Authentication hook
├── utils/
│   └── authUtils.js            # Authentication utilities
├── Components/
│   ├── AuthGuard.jsx           # Authentication guard component
│   └── axios.js                # Enhanced with interceptors
└── docs/
    └── AUTHENTICATION_GUIDE.md # This guide
```
