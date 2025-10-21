# 🎓 University Exam Management System - Frontend

> **Note**: This repository contains the **frontend application only**. For the complete system, you'll also need the backend API repository.

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

## 📸 Screenshots

### 🔐 Authentication

<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/75a877fc-19b4-432d-800f-d8e0e517b45c" alt="Sign In" />
      <p align="center"><b>Sign In</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/fa815954-7566-454d-9e2a-e7d8164cd7d5" alt="Sign Up" />
      <p align="center"><b>Sign Up</b></p>
    </td>
  </tr>
</table>

### 🔑 Admin Interface

<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/dd2ab08f-edc4-4029-953d-21c7c241caf7" alt="Admin Dashboard" />
      <p align="center"><b>Admin Dashboard</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/de5c9633-f219-4672-af44-05fc9e86d2d7" alt="User Management" />
      <p align="center"><b>User Management</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/066b48b4-23d9-42ba-9742-1551d180a056" alt="Department Management" />
      <p align="center"><b>Department Management</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/8480c0ee-117c-4ad1-bbcc-d19bc161756a" alt="Create New Department" />
      <p align="center"><b>Create New Department</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/c2523306-a32e-4a52-b60d-86581ad9878f" alt="Rooms Management" />
      <p align="center"><b>Rooms Management</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/5664a12f-7088-48a1-be0f-2ef3bdec4936" alt="Overall Exam Calendar" />
      <p align="center"><b>Overall Exam Calendar</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/5e4e4420-1377-4e14-85b6-f29694463e5f" alt="Student Enrollments" />
      <p align="center"><b>Student Enrollments</b></p>
    </td>
    <td width="50%"></td>
  </tr>
</table>

### 👨‍🏫 Faculty Interface

<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/0c6e6200-fef1-4c44-bbee-e0d7d8b75190" alt="Faculty Dashboard" />
      <p align="center"><b>Faculty Dashboard</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/d773e111-9314-49b3-b463-c1d08916bcbf" alt="Assigned Subject List" />
      <p align="center"><b>Assigned Subject List</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/23f56b86-e40c-4bee-96af-6e623aabc325" alt="Question Bank" />
      <p align="center"><b>Question Bank</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/32751849-8c5b-4ea2-b3c0-3227d6b39004" alt="Create Question" />
      <p align="center"><b>Create Question</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/cc68e7b2-ed83-4312-a058-0c5254ec8f62" alt="Create Question Details" />
      <p align="center"><b>Create Question (Continued)</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/3b37bfcf-086b-400d-9c4f-c9bf9f74e80a" alt="Create New Paper" />
      <p align="center"><b>Create New Paper</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/b1b3c026-d51a-46df-b1aa-f6eb22866abf" alt="Paper Details" />
      <p align="center"><b>Paper Details</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/e9e81fa1-ff98-4ec8-b954-e3ac197ed0a2" alt="View Exam Session List" />
      <p align="center"><b>View Exam Session List</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/b87f0cd5-a883-4c2f-81c1-a872da737658" alt="Mark Student Answers" />
      <p align="center"><b>Mark Student Answers</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/d5d96f9d-6d46-4dc5-b262-6bd30ea8186e" alt="Answer Marking Interface" />
      <p align="center"><b>Answer Marking Interface</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/2a085e0d-ff8b-46cf-b053-9475cd5b7ebb" alt="Student Result List" />
      <p align="center"><b>Student Result List</b></p>
    </td>
    <td width="50%"></td>
  </tr>
</table>

### 📊 Exam Coordinator Interface

<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/529a036a-f659-4128-b6f0-8bde51d089e6" alt="Exam Coordinator Dashboard" />
      <p align="center"><b>Exam Coordinator Dashboard</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/8d1e43fe-1401-4ae3-a777-79fdb9cad741" alt="Exam Session List" />
      <p align="center"><b>Exam Session List</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/f63befe3-2051-49d7-8dd6-0b25b0ef93fe" alt="Schedule New Exam" />
      <p align="center"><b>Schedule a New Exam</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/7a267285-e5c1-4a94-9554-c213b868cc50" alt="Exam Registration List" />
      <p align="center"><b>Exam Registration List</b></p>
    </td>
  </tr>
</table>

### 🎓 Student Interface

<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/d3a22a90-f0fe-4dae-8e11-f6e50979d912" alt="Student Dashboard" />
      <p align="center"><b>Student Dashboard</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/169da1d3-95c9-4003-aeee-5d380ed97b30" alt="Subject Enrollments" />
      <p align="center"><b>Subject Enrollments (Enroll New)</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/2dcf2c67-9846-4cb3-8d06-e71ca840fee8" alt="Enrollment List" />
      <p align="center"><b>Enrollment List</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/d0219a9f-3c3a-40b5-b256-8525f325e914" alt="Exam Calendar" />
      <p align="center"><b>Exam Calendar</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/124a2a2d-7716-4653-a9ea-9d5e5ecec969" alt="Exam Registrations" />
      <p align="center"><b>Exam Registrations</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/839f4e8b-570f-4f2f-9bee-c84db1ac01bb" alt="Results" />
      <p align="center"><b>Results</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/80708b26-e35f-4c92-a8ec-643a6c9b7edb" alt="Start Exam" />
      <p align="center"><b>Start Exam</b></p>
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/bcea3c28-19af-4999-baeb-49e6a422b34c" alt="Taking Exam" />
      <p align="center"><b>Taking Exam</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/7352d6ac-2f36-4c86-bb08-62a194e70f84" alt="Submit Exam" />
      <p align="center"><b>Submit Exam</b></p>
    </td>
    <td width="50%"></td>
  </tr>
</table>

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
- **Calendar View**: Visual calendar interface for exam scheduling and overview
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
- **Dark Mode**: Built-in dark mode support (Coming Soon)
- **Auto-Grading**: Automatic grading for MCQ questions
- **Answer Auto-Save**: Periodic auto-save during online exams
- **Exam Timer**: Visual countdown timer with warnings
- **Question Navigation**: Interactive question number panel with answer status indicators
- **Calendar Integration**: Visual exam calendar with filtering by year and semester
- **Sub-Question Support**: Hierarchical questions with automatic marks calculation
- **Marks Allocation**: Flexible marks distribution for structured questions
- **Search & Filter**: Advanced search and filtering across all modules
- **Data Export**: Export data to various formats (CSV, PDF)
- **Audit Logging**: Track all system activities for security
- **Student Enrollment**: Subject enrollment management with year/semester filtering
- **Marking Interface**: Faculty marking interface with student submission tracking

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
- **Calendar**: Custom calendar component with full-calendar integration

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **API Testing**: Swagger UI
- **Build Tool**: Next.js Turbopack

## 📁 Project Structure

> **Note**: This repository contains only the frontend code structure shown below.

```
University-Exam-Management-System-Frontend/     # This Repository
├── src/
│   ├── app/                                    # Next.js App Router
│   │   ├── (auth)/                             # Auth pages (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/                        # Dashboard pages
│   │   │   ├── admin/                          # Admin pages
│   │   │   │   ├── users/                      # User management
│   │   │   │   ├── departments/                # Department management
│   │   │   │   ├── subjects/                   # Subject management
│   │   │   │   ├── enrollments/                # Enrollment management
│   │   │   │   └── dashboard/                  # Admin dashboard
│   │   │   ├── faculty/                        # Faculty pages
│   │   │   │   ├── questions/                  # Question bank
│   │   │   │   ├── exam-papers/                # Exam papers
│   │   │   │   ├── marking/                    # Marking interface
│   │   │   │   └── dashboard/                  # Faculty dashboard
│   │   │   ├── exam-coordinator/               # Coordinator pages
│   │   │   │   ├── exam-sessions/              # Exam scheduling
│   │   │   │   ├── calendar/                   # Calendar view
│   │   │   │   ├── registrations/              # Registration management
│   │   │   │   └── dashboard/                  # Coordinator dashboard
│   │   │   ├── student/                        # Student pages
│   │   │   │   ├── exams/                      # Exam registration
│   │   │   │   ├── exam-paper/                 # Online exam taking
│   │   │   │   ├── results/                    # Results viewing
│   │   │   │   ├── enrollments/                # Subject enrollment
│   │   │   │   └── dashboard/                  # Student dashboard
│   │   │   └── invigilator/                    # Invigilator pages
│   │   ├── globals.css                         # Global styles
│   │   └── layout.tsx                          # Root layout
│   ├── components/                             # Reusable components
│   │   ├── ui/                                 # shadcn/ui components
│   │   ├── common/                             # Common components
│   │   ├── navigation/                         # Navigation components
│   │   └── data-display/                       # Data display components
│   ├── features/                               # Feature modules
│   │   ├── auth/                               # Auth features
│   │   ├── dashboard/                          # Dashboard features
│   │   ├── exam-papers/                        # Exam paper features
│   │   ├── exam-sessions/                      # Exam session features
│   │   ├── questions/                          # Question features
│   │   ├── results/                            # Result features
│   │   ├── users/                              # User features
│   │   ├── enrollments/                        # Enrollment features
│   │   ├── exam-registrations/                 # Registration features
│   │   └── ...                                 # Other features
│   ├── lib/                                    # Utilities & configs
│   │   ├── api/                                # API client
│   │   ├── auth/                               # Auth utilities
│   │   ├── hooks/                              # Custom hooks
│   │   └── utils/                              # Helper functions
│   ├── types/                                  # TypeScript types
│   └── constants/                              # Frontend constants
├── public/                                     # Static assets
│   ├── logo.png
│   └── ...
├── .env.local                                  # Environment variables
├── package.json                                # Dependencies
├── tsconfig.json                               # TypeScript config
├── tailwind.config.ts                          # Tailwind config
├── next.config.mjs                             # Next.js config
└── README.md                                   # This file
```

### Backend Repository Structure

The backend is in a separate repository with the following structure:

```
University-Exam-Management-System/              # Backend Repository (Separate)
├── src/
│   ├── modules/                                # Feature modules
│   │   ├── auth/                               # Authentication
│   │   ├── users/                              # User management
│   │   ├── questions/                          # Question bank
│   │   ├── exam-papers/                        # Exam papers
│   │   ├── exam-sessions/                      # Exam scheduling
│   │   └── ...                                 # Other modules
│   ├── common/                                 # Shared utilities
│   └── schemas/                                # MongoDB schemas
└── package.json
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Backend API** - Running instance of the backend server (see Backend Setup section)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <frontend-repository-url>
   cd University-Exam-Management-System-Frontend
   ```

2. **Ensure Backend is Running**
   - The backend API must be running on `http://localhost:3001`
   - See [Backend Setup](#-backend-setup) section for backend installation

3. **Set up Frontend** (See [Frontend Setup](#-frontend-setup))

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001/api/v1` (must be running separately)
   - API Docs: `http://localhost:3001/api-docs`

## 🔧 Backend Setup

> **Important**: The backend is in a separate repository. Clone and set it up before running the frontend.

### Installation

1. **Clone the backend repository**
   ```bash
   git clone <backend-repository-url>
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
- **Question Bank Management**:
  - Create questions with multiple types (MCQ, Structured, Essay)
  - Support for sub-questions with hierarchical structure (up to 3 levels)
  - Automatic marks calculation for parent questions
  - Bloom's taxonomy classification
  - Topic and subtopic organization
  - Public/private question sharing
- **Exam Paper Creation Wizard**:
  - Select questions from question bank
  - Organize questions into parts (A, B, C, etc.)
  - Set optional questions and minimum requirements
  - Automatic total marks calculation
  - Preview exam paper before publishing
- **Marking Interface**:
  - View student submissions
  - Mark answers with detailed feedback
  - Track marking progress
  - Filter by marked/unmarked status
- Student performance analytics
- Result management interface
- Subject-wise statistics

### Exam Coordinator Dashboard
- **Exam Scheduling Calendar**: Interactive calendar view with month/year navigation
  - Visual representation of all scheduled exams
  - Color-coded exam status (upcoming, ongoing, completed)
  - Filter exams by year and semester
  - Quick access to exam details
- Room and resource allocation
- Invigilator assignment interface
- Registration management
- Real-time exam monitoring
- Report generation tools

### Student Dashboard
- Upcoming exam schedule
- **Subject Enrollment**: Enroll in subjects by year and semester
- **Exam Registration Portal**: Register for available exam sessions
  - View exam details (date, time, mode, duration)
  - Check registration eligibility
  - Cancel registrations before deadline
- **Online Exam Interface** with:
  - **Question Navigator Panel**: Visual grid showing all questions
    - Green highlight for answered questions
    - Click to jump to any question
    - Organized by exam parts
  - Real-time timer with warnings (red when < 5 minutes)
  - Auto-save functionality (every 30 seconds)
  - Support for MCQ, structured, and essay questions
  - Sub-question navigation and tracking
  - Submit confirmation dialog
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

1. **Ensure Backend is Running** (from separate backend repository)
   ```bash
   cd University-Exam-Management-System
   npm run start:dev
   ```

2. **Frontend Development** (this repository)
   ```bash
   cd University-Exam-Management-System-Frontend
   npm run dev
   ```

3. **Make changes** and test in real-time with hot reload

4. **Run linting** before committing
   ```bash
   npm run lint
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

### Completed Features ✅
- **Backend API** - Fully functional REST API with Swagger documentation
- **Frontend UI** - Modern, responsive interface with TailwindCSS
- **Authentication System** - JWT-based auth with refresh tokens
- **User Management** - Complete RBAC system with 5 user roles
- **Department & Subject Management** - Full CRUD operations
- **Question Bank** - Multi-type questions with sub-question support
- **Exam Paper Creation** - Flexible paper design with parts and optional questions
- **Exam Scheduling** - Calendar view with session management
- **Student Enrollment** - Subject enrollment with year/semester filtering
- **Exam Registration** - Student registration for exam sessions
- **Online Exam Taking** - Full-featured exam interface with:
  - Question navigator panel
  - Real-time timer
  - Auto-save functionality
  - Sub-question support
- **Marking System** - Faculty marking interface with submission tracking
- **Result Management** - Result viewing and publishing
- **Reports & Analytics** - Dashboard analytics and insights

### Planned Features 🚧
- **Email Notifications** - Automated email alerts for exams and results
- **Mobile App** - Native mobile application
- **Advanced Analytics** - ML-based performance predictions
- **Plagiarism Detection** - AI-powered answer similarity checking
- **Video Proctoring** - Live monitoring for online exams
- **Question Import/Export** - Bulk question management

---

**Built with ❤️ for modern education**

*Last Updated: October 2025*
