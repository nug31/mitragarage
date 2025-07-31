# Deployment Guide - Mitra Garage

## Prerequisites
1. Railway account (for backend database)
2. Netlify account (for frontend hosting)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Deploy Backend to Railway

### 1.1 Prepare Backend for Railway
1. Navigate to the `backend` folder
2. Ensure your `.env` file has the correct Railway database credentials:
   ```
   DB_HOST=mainline.proxy.rlwy.net
   DB_PORT=56741
   DB_USER=root
   DB_PASSWORD=EVFpvQXkPaepZOKczcxOUSwlFRWIgGPQ
   DB_NAME=railway
   PORT=3001
   NODE_ENV=production
   ```

### 1.2 Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `backend` folder as the root directory
4. Railway will automatically detect it's a Node.js project
5. Set environment variables in Railway dashboard:
   - `DB_HOST`: mainline.proxy.rlwy.net
   - `DB_PORT`: 56741
   - `DB_USER`: root
   - `DB_PASSWORD`: EVFpvQXkPaepZOKczcxOUSwlFRWIgGPQ
   - `DB_NAME`: railway
   - `NODE_ENV`: production
   - `FRONTEND_URL`: https://your-netlify-app.netlify.app

6. Deploy and note your Railway backend URL (e.g., `https://your-app.railway.app`)

## Step 2: Deploy Frontend to Netlify

### 2.1 Update Frontend Configuration
1. Update the production API URLs in `src/config/api.ts`:
   ```typescript
   production: {
     baseURL: 'https://your-railway-backend-url.railway.app',
     apiURL: 'https://your-railway-backend-url.railway.app/api'
   }
   ```

### 2.2 Deploy to Netlify
1. Go to [Netlify.com](https://netlify.com)
2. Connect your Git repository
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `mitragarage-fixed` (if needed)

4. Set environment variables in Netlify:
   - `VITE_API_URL`: https://your-railway-backend-url.railway.app
   - `VITE_API_BASE_URL`: https://your-railway-backend-url.railway.app/api
   - `NODE_ENV`: production

5. Deploy and get your Netlify URL

### 2.3 Update CORS Settings
Update the backend CORS configuration to include your Netlify URL:
```javascript
app.use(cors({
  origin: [
    'https://your-netlify-app.netlify.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
```

## Step 3: Test Deployment
1. Visit your Netlify URL
2. Test login functionality
3. Verify all API endpoints work
4. Check database connectivity

## Environment Variables Summary

### Railway (Backend)
- `DB_HOST`: mainline.proxy.rlwy.net
- `DB_PORT`: 56741
- `DB_USER`: root
- `DB_PASSWORD`: EVFpvQXkPaepZOKczcxOUSwlFRWIgGPQ
- `DB_NAME`: railway
- `NODE_ENV`: production
- `FRONTEND_URL`: https://your-netlify-app.netlify.app

### Netlify (Frontend)
- `VITE_API_URL`: https://your-railway-backend-url.railway.app
- `VITE_API_BASE_URL`: https://your-railway-backend-url.railway.app/api
- `NODE_ENV`: production

## Troubleshooting
1. **CORS Issues**: Ensure backend CORS includes your Netlify domain
2. **API Connection**: Verify environment variables are set correctly
3. **Database**: Check Railway database is accessible
4. **Build Errors**: Check Node.js version compatibility

## Login Credentials
- Admin: username `admin`, password `admin123`
- Customer: username `customer_new`, password `customer123`
