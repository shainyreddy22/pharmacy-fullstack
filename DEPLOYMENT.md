# 🚀 Deployment Guide

## Option 1: Deploy to Render + Netlify (Recommended - Free)

### Backend Deployment (Render.com)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New+" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `pharmacy-backend`
     - Environment: `Java`
     - Build Command: `./mvnw clean package -DskipTests`
     - Start Command: `java -jar target/*.jar`
     - Branch: `main`

3. **Set Environment Variables**
   ```
   DATABASE_URL=jdbc:postgresql://your-postgres-url
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   JWT_SECRET=your-very-secure-secret-key
   PORT=8080
   ```

4. **Get your backend URL**
   - After deployment, you'll get a URL like: `https://pharmacy-backend-xyz.onrender.com`

### Frontend Deployment (Netlify)

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Set Environment Variable**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

4. **Deploy**
   - Your frontend will be available at: `https://your-site.netlify.app`

## Option 2: Deploy to Railway (All-in-one)

### Railway Deployment

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect it's a Java app
   - Set environment variables in the dashboard

3. **Add Database**
   - In Railway, add a PostgreSQL database
   - Get the database connection string
   - Set DATABASE_URL environment variable

## Option 3: Deploy to Heroku

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   brew tap heroku/brew && brew install heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-pharmacy-app
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set DATABASE_URL=your-database-url
   heroku config:set JWT_SECRET=your-secret-key
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## Database Options

### Free Database Providers:
- **Railway PostgreSQL** (Recommended - $5 free credit)
- **Supabase** (Generous free tier)
- **PlanetScale** (MySQL compatible)
- **Render PostgreSQL** (Free tier available)

### Using H2 Database (Development only):
If you want to use H2 database for simplicity, the app will work with in-memory database, but data will be lost on restart.

## Environment Variables Summary

### Backend (.env or platform settings):
```
DATABASE_URL=jdbc:postgresql://host:port/database
DB_USERNAME=database_user
DB_PASSWORD=database_password
JWT_SECRET=your-super-secret-jwt-key
PORT=8080
```

### Frontend (.env.production):
```
VITE_API_URL=https://your-backend-url.com/api
```

## Post-Deployment Steps

1. **Test the application**
   - Visit your frontend URL
   - Try logging in with default credentials: `admin` / `admin123`
   - Test all major features

2. **Configure Custom Domain** (Optional)
   - Both Netlify and Render support custom domains
   - Update DNS settings as per provider instructions

3. **Enable HTTPS** (Usually automatic)
   - Most platforms provide free SSL certificates

## Troubleshooting

### Common Issues:
- **CORS errors**: Make sure frontend URL is in backend CORS configuration
- **Database connection**: Verify DATABASE_URL format and credentials
- **Environment variables**: Double-check all required variables are set
- **Build failures**: Check logs in deployment platform dashboard

## Monitoring

- **Render**: Built-in logs and metrics
- **Netlify**: Analytics and form submissions
- **Railway**: Real-time logs and performance metrics

Need help? Check the platform documentation or open an issue in the repository.