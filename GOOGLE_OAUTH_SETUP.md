# Google OAuth Setup Guide

## Fix "redirect_uri_mismatch" Error

When you see the error:
```
Error 400: redirect_uri_mismatch
redirect_uri=http://localhost:3001/api/auth/callback/google
```

You need to add this exact URI to your Google Cloud Console OAuth 2.0 client.

## Steps to Fix

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Navigate to OAuth 2.0 Credentials
1. Select your project (or create a new one)
2. Go to **APIs & Services** > **Credentials**
3. Find your OAuth 2.0 Client ID (or create one if needed)
4. Click on the client to edit it

### 3. Add Authorized Redirect URI
In the **Authorized redirect URIs** section, add:
```
http://localhost:3001/api/auth/callback/google
```

**Important Notes:**
- The URI must match **exactly** (including `http://` not `https://` for localhost)
- Include the port number `:3001`
- The path `/api/auth/callback/google` is required (NextAuth default)

### 4. Save Changes
Click **Save** at the bottom of the page

### 5. Wait a Few Minutes
Google may take 1-2 minutes to propagate the changes

### 6. Try Again
Clear your browser cache/cookies and try signing in with Google again

## For Production

When deploying to production, you'll need to add your production redirect URI:
```
https://yourdomain.com/api/auth/callback/google
```

Make sure:
- `NEXTAUTH_URL` in your `.env` matches your production domain
- The redirect URI in Google Cloud Console matches exactly

## Verify Your Configuration

Your `.env` file should have:
```env
NEXTAUTH_URL="http://localhost:3001"
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

The redirect URI NextAuth uses is automatically constructed as:
```
${NEXTAUTH_URL}/api/auth/callback/google
```

So with `NEXTAUTH_URL="http://localhost:3001"`, it becomes:
```
http://localhost:3001/api/auth/callback/google
```

This exact URI must be in Google Cloud Console!

## Reference
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2/web-server#authorization-errors-redirect-uri-mismatch)
- NextAuth automatically handles the callback route at `/api/auth/callback/google`

