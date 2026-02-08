# Backend Deployment Guide for Render

## Prerequisites
- Render account (free tier available)
- GitHub repository with your code
- This repository structure

## Deployment Steps

### 1. Push Changes to GitHub
First, make sure all the changes are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "Update backend for Render deployment"
git push origin main
```

### 2. Deploy to Render

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Sign in with your GitHub account

2. **Create New Web Service**
   - Click "New+" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your pharmacy project

3. **Configure Service Settings**
   - **Name**: `pharmacy-backend`
   - **Environment**: `Docker`
   - **Root Directory**: `backend` (this is crucial!)
   - **Plan**: `Free` (or choose your preferred plan)

4. **Environment Variables**
   Render will automatically use the environment variables from `render.yaml`, but you can also set them manually:
   
   ```
   DATABASE_URL=jdbc:h2:mem:testdb
   DB_USERNAME=sa
   DB_PASSWORD=
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=8080
   ```

5. **Advanced Settings**
   - **Health Check Path**: `/actuator/health`
   - **Auto-Deploy**: Enabled (recommended)

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### 3. Monitor Deployment

1. **Build Process**
   - Watch the build logs in the Render dashboard
   - The build should take 5-10 minutes
   - Look for successful build completion

2. **Health Check**
   - Once deployed, Render will automatically check `/actuator/health`
   - Your service should show as "Healthy"

3. **Get Your URL**
   - After successful deployment, you'll get a URL like:
   - `https://pharmacy-backend-xxxx.onrender.com`

### 4. Test the Deployment

1. **API Health Check**
   ```bash
   curl https://your-render-url.onrender.com/actuator/health
   ```

2. **Test Authentication**
   ```bash
   curl -X POST https://your-render-url.onrender.com/api/auth/signin \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

3. **Test Other Endpoints**
   - Try accessing `/api/medicines`, `/api/dashboard/summary`, etc.

### 5. Production Database Setup (Optional)

For production use, you should connect to a real database:

1. **Add PostgreSQL Database**
   - In Render dashboard, create a new PostgreSQL database
   - Get the connection string

2. **Update Environment Variables**
   ```
   DATABASE_URL=your-postgresql-connection-string
   DB_USERNAME=your-db-username
   DB_PASSWORD=your-db-password
   HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
   ```

### 6. Frontend Configuration

Update your frontend to use the new backend URL:

1. **Set Environment Variable**
   ```
   VITE_API_URL=https://your-render-url.onrender.com/api
   ```

2. **Deploy Frontend**
   - Deploy your frontend to Netlify, Vercel, or similar
   - Make sure the API URL points to your Render backend

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs for Maven errors
   - Ensure all dependencies are in pom.xml
   - Verify Dockerfile syntax

2. **Health Check Failures**
   - Make sure actuator dependency is included
   - Check if port 8080 is being used
   - Verify application starts without errors

3. **Database Connection Issues**
   - Check DATABASE_URL format
   - Verify database credentials
   - Ensure proper dialect is set

4. **CORS Issues**
   - The backend already has CORS configured
   - Make sure frontend URL is in allowed origins

### Useful Commands:

```bash
# Test locally with Docker
cd backend
docker build -t pharmacy-backend .
docker run -p 8080:8080 pharmacy-backend

# Check logs
# In Render dashboard, go to your service → Logs

# Redeploy
# Make changes and push to GitHub
# Render will auto-deploy if enabled
```

## Security Considerations

1. **Change Default Credentials**
   - Update the default admin password
   - Use a strong JWT secret in production

2. **Environment Variables**
   - Never commit sensitive data to version control
   - Use Render's environment variable management

3. **HTTPS**
   - Render provides HTTPS automatically
   - All communication will be encrypted

## Cost

- **Free Tier**: Includes 1 web service with 512MB RAM
- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Paid Plans**: Starting at $7/month for always-on services

Your backend should now be successfully deployed and ready to serve your pharmacy management application!