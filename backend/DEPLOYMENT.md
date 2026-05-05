# Employee Management System - Backend Deployment

## 🚀 Deploying to Render

### Prerequisites
1. **MongoDB Database**: Set up a MongoDB Atlas cluster or use a cloud MongoDB service
2. **Firebase Project**: Configure Firebase project with Authentication enabled
3. **Render Account**: Sign up at [render.com](https://render.com)

### Environment Variables Required

Set these environment variables in your Render dashboard:

#### Database
- `MONGODB_URI`: Your MongoDB connection string (required)

#### Authentication
- `JWT_SECRET`: Random secret key for JWT tokens (Render can generate this)

#### Firebase Configuration
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Your Firebase service account private key
- `FIREBASE_CLIENT_EMAIL`: Your Firebase service account email
- `FIREBASE_PRIVATE_KEY_ID`: Your Firebase private key ID
- `FIREBASE_CLIENT_ID`: Your Firebase client ID
- `FIREBASE_CLIENT_X509_CERT_URL`: Your Firebase cert URL
- `FIREBASE_DATABASE_URL`: Your Firebase database URL

### Deployment Steps

1. **Connect Repository**
   - Go to [render.com](https://render.com) and click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `employee-management-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables**
   - Add all the environment variables listed above
   - For `MONGODB_URI`, use your MongoDB Atlas connection string
   - For Firebase variables, download your service account key from Firebase Console

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Troubleshooting

#### Common Issues:

1. **Port Error**: Render automatically assigns a port via `process.env.PORT`

2. **Database Connection**: Ensure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` for all IPs

3. **Firebase Configuration**: Make sure all Firebase environment variables are set correctly. The private key should be properly formatted with `\n` for line breaks.

4. **Build Failures**: Check the build logs for specific error messages

#### Firebase Private Key Formatting:
When setting the `FIREBASE_PRIVATE_KEY` environment variable, ensure it's properly formatted:
```
-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n
```

### Frontend Deployment

After deploying the backend, update your frontend applications to use the Render backend URL instead of `localhost:5000`.

### Testing Deployment

Once deployed, test these endpoints:
- `GET /api/health` - Health check
- `POST /api/auth/login` - Authentication
- `GET /api/chat` - Chat functionality

### Support

If you encounter issues:
1. Check Render deployment logs
2. Verify all environment variables are set
3. Ensure MongoDB connection string is correct
4. Test Firebase configuration locally first