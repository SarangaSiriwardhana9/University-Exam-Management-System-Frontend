# 🎓 University Exam Management System

A comprehensive full-stack application for managing university examinations, built with modern technologies. This system provides end-to-end solutions for exam scheduling, question management, student enrollment, online exam taking, result processing, and administrative oversight.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [User Roles & Permissions](#-user-roles--permissions)
- [Key Features by Role](#-key-features-by-role)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

The University Exam Management System is a modern, scalable solution designed to digitize and streamline the entire examination process at universities. From creating question banks to conducting online exams and generating comprehensive reports, this system handles it all with security, efficiency, and user-friendliness in mind.

### Why This System?

- **Paperless Exams**: Conduct fully online examinations with automated grading
- **Centralized Management**: Single platform for all exam-related activities
- **Role-Based Access**: Secure, permission-based system for different user types
- **Real-Time Updates**: Instant notifications and live exam monitoring
- **Comprehensive Analytics**: Detailed reports and insights for decision-making
- **Scalable Architecture**: Built to handle thousands of concurrent users

## ✨ Features

### 🎯 Core Functionality

#### For Administrators
- **User Management**: Create and manage users across all roles
- **Department & Subject Management**: Organize academic structure
- **System Configuration**: Configure exam settings, grading scales, and policies
- **Comprehensive Reports**: Generate system-wide analytics and insights
- **Academic Calendar**: Manage semesters, terms, and important dates

#### For Faculty
- **Question Bank**: Create and organize questions with multiple types (MCQ, Structured, Essay)
- **Exam Paper Creation**: Design exam papers with flexible question selection
- **Bloom's Taxonomy**: Classify questions by cognitive levels
- **Result Management**: Review and publish student results
- **Performance Analytics**: Track student performance trends

#### For Exam Coordinators
- **Exam Scheduling**: Schedule exams with room and time slot management
- **Invigilator Assignment**: Assign and manage invigilators for exam sessions
- **Student Registration**: Manage exam registrations and eligibility
- **Session Monitoring**: Real-time monitoring of ongoing exams
- **Report Generation**: Create detailed exam reports

#### For Students
- **Exam Registration**: Register for eligible exams
- **Online Exam Taking**: Take exams with intuitive interface
- **Real-Time Timer**: Visual countdown for exam duration
- **Auto-Save**: Automatic answer saving to prevent data loss
- **Result Viewing**: Access results and performance feedback
- **Exam Schedule**: View upcoming exam schedules

#### For Invigilators
- **Session Overview**: View assigned exam sessions
- **Student Monitoring**: Track student attendance and progress
- **Incident Reporting**: Report irregularities during exams

### 🚀 Advanced Features

- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control (RBAC)**: Fine-grained permissions system
- **Real-Time Notifications**: Instant updates for exam schedules, results, and announcements
- **File Upload Support**: Upload exam materials, images, and documents
- **Responsive Design**: Fully responsive UI for desktop, tablet, and mobile
- **Dark Mode**: Built-in dark mode support
- **Auto-Grading**: Automatic grading for MCQ questions
- **Answer Auto-Save**: Periodic auto-save during online exams
- **Exam Timer**: Visual countdown timer with warnings
- **Question Navigation**: Easy navigation between questions during exams
- **Search & Filter**: Advanced search and filtering across all modules
- **Data Export**: Export data to various formats (CSV, PDF)
- **Audit Logging**: Track all system activities for security

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: bcryptjs, CORS, helmet
- **Testing**: Jest

### Frontend
- **Framework**: Next.js 15.x (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 19.x
- **Styling**: TailwindCSS 4.x
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Notifications**: Sonner

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **API Testing**: Swagger UI
- **Build Tool**: Next.js Turbopack

## 📁 Project Structure

```
exam-new/
├── University-Exam-Management-System/          # Backend (NestJS)
│   ├── src/
│   │   ├── common/                             # Shared utilities
│   │   │   ├── constants/                      # Application constants
│   │   │   ├── decorators/                     # Custom decorators
│   │   │   ├── guards/                         # Auth guards
│   │   │   └── utils/                          # Utility functions
│   │   ├── config/                             # Configuration files
│   │   ├── modules/                            # Feature modules
│   │   │   ├── auth/                           # Authentication
│   │   │   ├── users/                          # User management
│   │   │   ├── departments/                    # Departments
│   │   │   ├── subjects/                       # Subjects
│   │   │   ├── questions/                      # Question bank
│   │   │   ├── exam-papers/                    # Exam papers
│   │   │   ├── exam-sessions/                  # Exam scheduling
│   │   │   ├── exam-registrations/             # Exam registrations
│   │   │   ├── student-answers/                # Answer submissions
│   │   │   ├── results/                        # Results
│   │   │   ├── rooms/                          # Room management
│   │   │   ├── invigilator-assignments/        # Invigilators
│   │   │   ├── student-enrollments/            # Enrollments
│   │   │   ├── academic-calendar/              # Calendar
│   │   │   ├── notifications/                  # Notifications
│   │   │   ├── file-uploads/                   # File management
│   │   │   ├── reports/                        # Reports
│   │   │   └── dashboard/                      # Dashboard
│   │   └── schemas/                            # MongoDB schemas
│   ├── test/                                   # Test files
│   └── package.json
│
├── University-Exam-Management-System-Frontend/ # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                                # Next.js App Router
│   │   │   ├── (auth)/                         # Auth pages
│   │   │   └── (dashboard)/                    # Dashboard pages
│   │   ├── components/                         # Reusable components
│   │   │   ├── ui/                             # shadcn/ui components
│   │   │   └── ...                             # Custom components
│   │   ├── features/                           # Feature modules
│   │   │   ├── auth/                           # Auth features
│   │   │   ├── dashboard/                      # Dashboard features
│   │   │   ├── exam-papers/                    # Exam paper features
│   │   │   ├── exam-sessions/                  # Exam session features
│   │   │   ├── questions/                      # Question features
│   │   │   ├── results/                        # Result features
│   │   │   ├── users/                          # User features
│   │   │   └── ...                             # Other features
│   │   ├── lib/                                # Utilities & configs
│   │   ├── types/                              # TypeScript types
│   │   └── constants/                          # Frontend constants
│   ├── public/                                 # Static assets
│   └── package.json
│
└── README.md                                   # This file
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd exam-new
   ```

2. **Set up Backend** (See [Backend Setup](#-backend-setup))

3. **Set up Frontend** (See [Frontend Setup](#-frontend-setup))

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001/api/v1`
   - API Docs: `http://localhost:3001/api-docs`

## 🔧 Backend Setup

### Installation

1. **Navigate to backend directory**
   ```bash
   cd University-Exam-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the backend root:
   ```env
   # Application
   PORT=3001
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/university-exam-db
   DB_NAME=university-exam-db

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=1d
   JWT_REFRESH_SECRET=your-refresh-token-secret-change-this
   JWT_REFRESH_EXPIRES_IN=7d

   # Security
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Start MongoDB**
   ```bash
   # On Windows
   mongod

   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the backend**
   ```bash
   # Development mode with hot reload
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Verify backend is running**
   - API: `http://localhost:3001/api/v1/health`
   - Swagger Docs: `http://localhost:3001/api-docs`

### Default Admin Credentials

On first run, a default admin account is automatically created:
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@university.edu`

⚠️ **Security Warning**: Change the default password immediately after first login!

### Backend Scripts

```bash
npm run start:dev          # Development with hot reload
npm run start:debug        # Debug mode
npm run build              # Build for production
npm run start:prod         # Run production build
npm run lint               # Lint code
npm run format             # Format code with Prettier
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Test coverage
```

## 💻 Frontend Setup

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd University-Exam-Management-System-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the frontend root:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Optional: Enable debug mode
   NEXT_PUBLIC_DEBUG=false
   ```

4. **Run the frontend**
   ```bash
   # Development mode with Turbopack
   npm run dev

   # Production build
   npm run build
   npm run start
   ```

5. **Access the application**
   - Open browser: `http://localhost:3000`
   - Login with admin credentials

### Frontend Scripts

```bash
npm run dev                # Development with Turbopack
npm run build              # Build for production
npm run start              # Run production build
npm run lint               # Lint code
```

## 👥 User Roles & Permissions

The system implements a comprehensive role-based access control (RBAC) system with five distinct roles:

### 1. 🔑 Admin
**Full system access and control**
- Manage all users (create, update, delete, activate/deactivate)
- Manage departments and subjects
- Configure system settings and policies
- View all reports and analytics
- Access all modules and features
- Manage academic calendar
- Override permissions when necessary

### 2. 👨‍🏫 Faculty
**Academic content management**
- Create and manage question bank
- Design and create exam papers
- Assign questions to exam papers
- View and manage student results
- Generate performance reports
- Manage own profile
- View department and subject information

### 3. 📊 Exam Coordinator
**Exam operations management**
- Schedule exam sessions
- Assign rooms and time slots
- Manage invigilator assignments
- Handle exam registrations
- Monitor ongoing exams
- Generate exam reports
- Manage exam calendar
- Handle student queries

### 4. 👁️ Invigilator
**Exam supervision**
- View assigned exam sessions
- Mark student attendance
- Monitor exam progress
- Report irregularities
- Submit session reports
- View exam schedules

### 5. 🎓 Student
**Exam participation**
- Register for eligible exams
- Take online exams
- View exam schedules
- Submit exam answers
- View results and grades
- Receive notifications
- View academic calendar
- Update profile information

## 🎯 Key Features by Role

### Admin Dashboard
- System overview with key metrics
- User management interface
- Department and subject management
- System configuration panel
- Comprehensive analytics and reports
- Activity logs and audit trails

### Faculty Dashboard
- Question bank management
- Exam paper creation wizard
- Student performance analytics
- Result management interface
- Subject-wise statistics

### Exam Coordinator Dashboard
- Exam scheduling calendar
- Room and resource allocation
- Invigilator assignment interface
- Registration management
- Real-time exam monitoring
- Report generation tools

### Student Dashboard
- Upcoming exam schedule
- Exam registration portal
- Online exam interface with:
  - Question navigation
  - Timer with warnings
  - Auto-save functionality
  - Flag questions for review
  - Submit confirmation
- Results and grade history
- Notification center

### Invigilator Dashboard
- Assigned exam sessions
- Student attendance tracking
- Exam monitoring tools
- Incident reporting

## 📚 API Documentation

The backend provides comprehensive API documentation via Swagger/OpenAPI.

### Accessing API Docs
- **URL**: `http://localhost:3001/api-docs`
- **Interactive**: Try out endpoints directly from the browser
- **Authentication**: Use Bearer token authentication

### Key API Endpoints

#### Authentication
```
POST   /api/v1/auth/login          # User login
POST   /api/v1/auth/register       # Student registration
POST   /api/v1/auth/logout         # User logout
POST   /api/v1/auth/refresh        # Refresh access token
```

#### Users
```
GET    /api/v1/users               # List all users
GET    /api/v1/users/:id           # Get user by ID
POST   /api/v1/users               # Create user
PATCH  /api/v1/users/:id           # Update user
DELETE /api/v1/users/:id           # Delete user
GET    /api/v1/users/profile       # Get current user profile
```

#### Questions
```
GET    /api/v1/questions           # List questions
POST   /api/v1/questions           # Create question
GET    /api/v1/questions/:id       # Get question details
PATCH  /api/v1/questions/:id       # Update question
DELETE /api/v1/questions/:id       # Delete question
```

#### Exam Papers
```
GET    /api/v1/exam-papers         # List exam papers
POST   /api/v1/exam-papers         # Create exam paper
GET    /api/v1/exam-papers/:id     # Get exam paper
PATCH  /api/v1/exam-papers/:id     # Update exam paper
DELETE /api/v1/exam-papers/:id     # Delete exam paper
```

#### Exam Sessions
```
GET    /api/v1/exam-sessions       # List exam sessions
POST   /api/v1/exam-sessions       # Schedule exam
GET    /api/v1/exam-sessions/:id   # Get session details
PATCH  /api/v1/exam-sessions/:id   # Update session
POST   /api/v1/exam-sessions/:id/start    # Start exam
POST   /api/v1/exam-sessions/:id/end      # End exam
```

#### Results
```
GET    /api/v1/results             # List results
GET    /api/v1/results/:id         # Get result details
POST   /api/v1/results             # Create result
PATCH  /api/v1/results/:id         # Update result
GET    /api/v1/results/student/:id # Get student results
```

For complete API documentation, visit the Swagger UI when the backend is running.

## 📸 Screenshots

_Add screenshots of your application here_

## 💻 Development

### Development Workflow

1. **Backend Development**
   ```bash
   cd University-Exam-Management-System
   npm run start:dev
   ```

2. **Frontend Development**
   ```bash
   cd University-Exam-Management-System-Frontend
   npm run dev
   ```

3. **Make changes** and test in real-time with hot reload

4. **Run tests** before committing
   ```bash
   # Backend tests
   cd University-Exam-Management-System
   npm run test

   # Frontend tests (if configured)
   cd University-Exam-Management-System-Frontend
   npm run test
   ```

### Code Style Guidelines

- **TypeScript**: Use strict mode, avoid `any` types
- **Naming**: Use camelCase for variables, PascalCase for components/classes
- **Components**: One component per file, use functional components
- **Formatting**: Run Prettier before committing
- **Linting**: Fix all ESLint warnings

### Git Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. Push and create pull request
   ```bash
   git push origin feature/your-feature-name
   ```

## 🧪 Testing

### Backend Testing

```bash
cd University-Exam-Management-System

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov

# Run e2e tests
npm run test:e2e
```

### Frontend Testing

```bash
cd University-Exam-Management-System-Frontend

# Run tests (if configured)
npm run test
```

### Manual Testing Checklist

- [ ] User authentication (login, logout, refresh token)
- [ ] User registration with university email
- [ ] Create and manage questions
- [ ] Create exam papers with questions
- [ ] Schedule exam sessions
- [ ] Student exam registration
- [ ] Take online exam (timer, navigation, auto-save)
- [ ] Submit exam answers
- [ ] View results
- [ ] Generate reports
- [ ] Role-based access control

## 🚀 Deployment

### Backend Deployment

#### Using PM2 (Recommended for production)

```bash
# Install PM2 globally
npm install -g pm2

# Build the application
cd University-Exam-Management-System
npm run build

# Start with PM2
pm2 start dist/main.js --name university-exam-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

#### Using Docker

```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main"]
```

### Frontend Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd University-Exam-Management-System-Frontend
vercel
```

#### Build for Production

```bash
cd University-Exam-Management-System-Frontend
npm run build
npm run start
```

### Environment Variables for Production

**Backend (.env)**
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-strong-production-secret
```

**Frontend (.env.production)**
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow code style guidelines
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
   
   Use conventional commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Test updates
   - `chore:` Build/config updates

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Wait for review

### Code Review Process

- All PRs require at least one approval
- CI/CD checks must pass
- Code must follow style guidelines
- Tests must pass

## 📄 License

This project is licensed under the **UNLICENSED** license - it is proprietary software.

## 📞 Support & Contact

For support, questions, or feedback:

- **Issues**: Open an issue on GitHub
- **Email**: support@university-exam-system.com
- **Documentation**: See `/docs` folder for detailed guides

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- UI powered by [Next.js](https://nextjs.org/)
- Components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📊 Project Status

- ✅ Backend API - Complete
- ✅ Frontend UI - Complete
- ✅ Authentication System - Complete
- ✅ Exam Management - Complete
- ✅ Online Exam Taking - Complete
- ✅ Result Management - Complete
- ✅ Reports & Analytics - Complete
- 🚧 Mobile App - Planned
- 🚧 Email Notifications - Planned

---

**Built with ❤️ for modern education**

*Last Updated: October 2025*
