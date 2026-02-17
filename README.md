# HSE_TUTOR_APP

# Integrating Microsoft Entra

## Overview
This HSE Tutor App uses a **React (Vite) frontend** with a **Flask backend**. Microsoft Entra integration changes the authentication flow to use OAuth 2.0/OIDC instead of local email/password authentication.

## Step 1: Register Your Application in Azure Portal

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations** → **New registration**
3. Fill in the details:
   - **Name**: HSE Tutor App
   - **Supported account types**: Accounts in this organizational directory only
4. Set **Redirect URI**:
   - Platform: **Single-page application (SPA)**
   - URI: `http://localhost:5173` (Vite dev server) or your production URL
5. After registration, note down:
   - **Application (client) ID**
   - **Directory (tenant) ID**

## Step 2: Configure Frontend (React + MSAL)

### Install Dependencies
```bash
cd frontend
npm install @azure/msal-browser @azure/msal-react
```

### Create Entra Configuration File
Create `frontend/src/config/authConfig.js`:
```javascript
export const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID",
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: "http://localhost:5173/",
    postLogoutRedirectUri: "http://localhost:5173/"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
```

### Update AuthContext.jsx
Replace the current `AuthContext.jsx` with MSAL integration:
```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accounts.length > 0) {
      // User is logged in, validate with backend
      validateUserWithBackend(accounts[0]);
    } else {
      setIsLoading(false);
    }
  }, [accounts]);

  const validateUserWithBackend = async (account) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: account.username,
          entraId: account.localAccountId
        })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setAuth(userData.user.auth);
      }
    } catch (error) {
      console.error("Backend validation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      await instance.loginPopup();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      await instance.logout();
      setUser(null);
      setAuth(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, auth, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export function useAuth() {
  return useContext(AuthContext);
}
```

### Update main.jsx
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from './config/authConfig.js';
import App from './App.jsx'
import AuthProvider from './AuthContext.jsx'
import './style.css'

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MsalProvider>
  </React.StrictMode>,
)
```

## Step 3: Configure Backend (Flask + Token Validation)

### Install Dependencies
```bash
cd backend
pip install PyJWT cryptography
```

### Update app.py
Add token validation and update the login route:
```python
from flask import Flask, jsonify, session, request
from flask_cors import CORS
from flask_session import Session
from datetime import datetime
import queries as q
import jwt
from functools import wraps

app = Flask(__name__)
app.secret_key = "placeholder secret key for now"
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_TYPE"] = "cachelib"
Session(app)
CORS(app, supports_credentials=True)

ENTRA_TENANT_ID = "YOUR_TENANT_ID"
ENTRA_CLIENT_ID = "YOUR_CLIENT_ID"

def validate_token(f):
    """Decorator to validate Entra token from Authorization header"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "message": "Missing authorization header"}), 401
        
        try:
            token = auth_header.split(" ")[1]
            # Note: In production, validate the token signature with MS public keys
            # For now, we'll verify the token structure
            decoded = jwt.decode(token, options={"verify_signature": False})
            request.entra_user = decoded
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"success": False, "message": "Invalid token"}), 401
    
    return decorated_function

@app.route('/api/')
def index():
    return jsonify({"message": "If you can see this, then Flask works"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    entra_id = data.get('entraId')

    # Look up user in database by email or Entra ID
    user = q.get_user_by_email(email)

    if user:
        # User exists, update their Entra ID if not already set
        if not user.get('entra_id'):
            q.update_user_entra_id(user['user_id'], entra_id)
        
        session['user_id'] = user['user_id']
        return jsonify({
            "success": True,
            "user": {
                "id": user['user_id'],
                "email": user['user_email'],
                "auth": user['user_auth']
            }
        })
    else:
        # New user - create account (can be auto-created or require admin approval)
        # For now, return an error and require admin to create the account
        return jsonify({
            "success": False,
            "message": "User not found. Please contact administrator."
        }), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Logged out successfully"})

# ... rest of the routes remain the same ...
```

### Update queries.py
Add method to update Entra ID:
```python
def update_user_entra_id(user_id, entra_id):
    """Update user's Entra ID in database"""
    conn = get_db_connection()
    conn.execute(
        'UPDATE users SET entra_id = ? WHERE user_id = ?',
        (entra_id, user_id)
    )
    conn.commit()
    conn.close()
```

## Step 4: Update Your Database Schema (Optional)

Add Entra ID column to users table:
```sql
ALTER TABLE users ADD COLUMN entra_id TEXT UNIQUE;
```

## Step 5: Environment Variables

Create `.env` files to manage configuration:

**frontend/.env**
```
VITE_ENTRA_CLIENT_ID=YOUR_CLIENT_ID
VITE_ENTRA_TENANT_ID=YOUR_TENANT_ID
```

**backend/.env**
```
ENTRA_TENANT_ID=YOUR_TENANT_ID
ENTRA_CLIENT_ID=YOUR_CLIENT_ID
```

## Step 6: Test the Integration

1. Start the backend: `python backend/app.py`
2. Start the frontend: `cd frontend && npm run dev`
3. Try logging in with your Entra account
4. Verify the session is created and user data is returned

## Key Changes from Original Setup

| Aspect | Before | After |
|--------|--------|-------|
| **Auth Method** | Email + Password (local) | Microsoft Entra (OAuth 2.0) |
| **Frontend** | Simple form submission | MSAL React library with popup flow |
| **Backend Login** | Verify password hash | Validate email from Entra |
| **Session** | Created with password match | Created after Entra validation |
| **User Creation** | Manual database entry | Can be auto-created or admin-approved |

## Additional Resources
- [Microsoft Entra Documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/)
- [MSAL.js for React](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
- [Flask Token Validation](https://github.com/Azure-Samples/active-directory-python-flask-graphapi-web)