# 🏥 Pharmacy Management System

A full-stack pharmacy management web application built with Spring Boot and React that helps pharmacies efficiently manage inventory, sales, customers, and suppliers.

## 🌟 Features

### 🔐 Authentication & Security
- JWT-based authentication system
- Secure user registration and login
- Role-based access control
- Password encryption with BCrypt

### 📦 Inventory Management
- Add, edit, and delete medicines
- Track stock quantities in real-time
- Monitor expiration dates
- Categorize medicines (OTC, Prescription, Supplements)
- Low stock alerts and notifications

### 💰 Sales Processing
- Create and process sales transactions
- Automatic stock deduction
- Customer management during sales
- Sales history tracking
- Receipt generation

### 👥 Customer & Supplier Management
- Maintain customer database with contact information
- Track supplier details and relationships
- Purchase order management
- Customer purchase history

### 📊 Reporting & Analytics
- Dashboard with key metrics
- Sales reports and analytics
- Inventory status reports
- Low stock alerts
- Expiration date monitoring

## 🛠️ Tech Stack

### Backend
- **Java 17** - Primary programming language
- **Spring Boot 2.7.10** - Web framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **MySQL 8.0** - Production database
- **H2 Database** - Development database
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### Frontend
- **React 19.2.0** - JavaScript library for UI
- **Vite 7.2.4** - Build tool and development server
- **Bootstrap 5.3.8** - CSS framework
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 (or use H2 for development)
- Maven 3.6+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pharmacy-management-system.git
cd pharmacy-management-system
```

2. **Backend Setup**
```bash
cd backend
# Update application.properties with your database credentials
mvn clean install
mvn spring-boot:run
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### Database Configuration

#### Development (H2 Database)
The application uses H2 in-memory database by default for development.

#### Production (MySQL)
1. Create a MySQL database:
```sql
CREATE DATABASE pharmacy_db;
```

2. Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pharmacy_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 🌐 Deployment

### Backend Deployment (Render)

The backend is configured for easy deployment on Render:

1. **Prerequisites**
   - Push all changes to GitHub
   - Create a Render account

2. **Deploy Steps**
   ```bash
   # Commit changes
   git add .
   git commit -m "Configure for Render deployment"
   git push origin main
   ```

3. **Render Configuration**
   - Go to [Render Dashboard](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository
   - Set **Root Directory** to `backend`
   - Environment: `Docker`
   - Auto-deploy: Enabled

4. **Environment Variables**
   Render will automatically use values from `render.yaml`:
   ```
   DATABASE_URL=jdbc:h2:mem:testdb
   DB_USERNAME=sa
   DB_PASSWORD=
   JWT_SECRET=your-super-secret-jwt-key
   PORT=8080
   ```

5. **Test Deployment**
   ```bash
   ./test-deployment.sh https://your-render-url.onrender.com
   ```

### Frontend Deployment Options
- **Netlify** - [netlify.com](https://netlify.com)
- **Vercel** - [vercel.com](https://vercel.com)
- **GitHub Pages** - Free static hosting

### Environment Variables
Set these environment variables in your deployment platform:

**Backend:**
```bash
# For production database (PostgreSQL example)
DATABASE_URL=jdbc:postgresql://your-database-url
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Port (Render sets this automatically)
PORT=8080
```

**Frontend:**
```bash
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Detailed Deployment Guide
See [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md) for comprehensive deployment instructions and [DEPLOYMENT_CHANGES.md](DEPLOYMENT_CHANGES.md) for a summary of all changes made.

## 📁 Project Structure

```
pharmacy-fullstack/
├── backend/                    # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/pharmacy/pharmacy_backend/
│   │   │   │       ├── controller/     # REST Controllers
│   │   │   │       ├── model/          # JPA Entities
│   │   │   │       ├── repository/     # Data Access Layer
│   │   │   │       ├── service/        # Business Logic
│   │   │   │       ├── security/       # Authentication
│   │   │   │       └── config/         # Configuration
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
└── frontend/                   # React Application
    ├── src/
    │   ├── components/         # React Components
    │   ├── pages/              # Page Components
    │   ├── services/           # API Services
    │   ├── context/            # React Context
    │   └── assets/             # Static Assets
    ├── public/
    └── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Medicines
- `GET /api/medicines` - Get all medicinesh
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/{id}` - Update medicine
- `DELETE /api/medicines/{id}` - Delete medicine

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard statistics
- `GET /api/dashboard/low-stock` - Get low stock items
- `GET /api/dashboard/recent-sales` - Get recent sales

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by the need for efficient pharmacy management solutions
- Built with modern web technologies for optimal performance

## 📞 Support

For support, email karnatishainyreddy@gmail.com or open an issue in this repository.

---
Made with ❤️ for pharmacy professionals worldwide
