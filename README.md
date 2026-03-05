# Waste Management System

A comprehensive web application for managing garbage collection services with role-based workflow, real-time status tracking, and AI-powered content moderation.

## Overview

This system provides complete garbage management workflow automation with three user roles: Citizens submit service requests, Workers handle assigned tasks, and Administrators oversee operations. The platform includes AI content moderation for user submissions, comprehensive analytics, and mobile-responsive design.

## Features

### Core System
- User authentication with JWT tokens and role-based access control
- Citizens submit garbage reports with photos and GPS location
- Admin dashboard for reviewing and managing reports
- Worker task assignment and workflow management
- Real-time status tracking across all user roles
- File upload functionality for report photos and proof of work
- Mobile-responsive web interface

### AI Content Moderation
- Real-time analysis of user submissions for harmful content
- Three-tier severity classification (mild, moderate, severe)
- Visual warnings with color-coded alerts
- Automatic blocking of severe content
- Admin dashboard displays AI analysis insights
- Comprehensive word detection including profanity and threats

### Analytics & Management
- Comprehensive analytics and reporting for admin users
- Worker performance metrics and workload management
- System statistics and audit trails
- Feedback and issue submission system
- Notification system for status updates

## User Roles & Features

### Citizens
- Submit garbage reports with photos and location data
- Track report status through complete lifecycle
- Submit feedback and issues to administrators
- Receive notifications about status changes
- View personal report history

### Workers
- View assigned tasks and work orders
- Update task status (accept, in-progress, complete)
- Upload before/after photos as proof of work
- View performance metrics and workload
- Request task reassignment when needed

### Administrators
- Review and approve/reject citizen reports
- Assign workers to reports and manage tasks
- Monitor system analytics and statistics
- Manage user accounts and permissions
- Handle citizen feedback and issues
- View AI-moderated content analysis
- Access audit logs and system activity

## AI Content Moderation System

### Detection Categories
- **Threats**: Kill, harm, murder, death, destroy
- **Profanity**: Comprehensive vulgar word detection
- **Harassment**: Hate speech, personal attacks
- **Violence**: Physical harm descriptions

### Severity Levels
- **Mild**: Single mild profanity words (yellow warning)
- **Moderate**: Strong profanity or harassment (orange warning)
- **Severe**: Threats and violence (red warning + submission blocked)

### Admin Features
- AI analysis display in feedback management
- Content flagging for review
- Confidence scores and category detection
- Audit trail of moderated content

## Project Structure

```
garbage-management-system/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication endpoints
│   │   │   ├── garbageReports.js    # Garbage report management
│   │   │   ├── tasks.js             # Task assignment and workflow
│   │   │   ├── feedback.js          # Feedback submission with AI
│   │   │   ├── issues.js            # Issues and unified feedback
│   │   │   ├── workload.js          # Worker performance metrics
│   │   │   └── notifications.js     # System notifications
│   │   ├── services/
│   │   │   └── notificationService.js # Notification management
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   └── server.js                # Express server setup
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema definition
│   │   ├── migrations/              # Database migration files
│   │   └── dev.db                   # SQLite development database
│   ├── uploads/                     # User uploaded files
│   ├── .env                         # Environment variables
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeedbackForm.jsx      # Feedback submission with AI
│   │   │   ├── FeedbackManagement.jsx # Admin feedback management
│   │   │   ├── ContentWarning.jsx    # AI warning display component
│   │   │   ├── ReportDetailModal.jsx # Report detail view
│   │   │   └── ...                   # Other UI components
│   │   ├── pages/
│   │   │   ├── CitizenDashboard.jsx  # Citizen main interface
│   │   │   ├── WorkerDashboard.jsx   # Worker task management
│   │   │   ├── AdminDashboard.jsx    # Admin management interface
│   │   │   └── Login.jsx             # Authentication page
│   │   ├── services/
│   │   │   ├── aiContentModeration.js # AI analysis service
│   │   │   └── api.js                # API client configuration
│   │   ├── utils/
│   │   │   ├── statusHelpers.jsx     # Status badge utilities
│   │   │   └── ...                   # Helper functions
│   │   ├── styles/
│   │   │   └── globals.css           # Global CSS styles
│   │   ├── App.jsx                   # Main application component
│   │   └── main.jsx                 # Application entry point
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
└── package.json                     # Root package configuration
```

## Technical Architecture

### Backend
- Node.js with Express.js framework
- Prisma ORM with SQLite database
- JWT authentication with bcrypt
- Multer for file uploads
- AI content analysis engine

### Frontend
- React with Vite build tool
- TailwindCSS for responsive styling
- Axios for HTTP requests
- React Hot Toast for notifications
- Real-time content analysis

### Database Schema
- Users: Authentication and role management
- GarbageReports: Citizen reports with status tracking
- Tasks: Worker assignments with workflow states
- Feedback: Citizen feedback with AI analysis
- Issues: Disputes and service issues
- Workers: Worker profiles and performance data
- Notifications: System notifications
- AuditLogs: Activity tracking

## Workflow States

### Garbage Reports
- REPORTED → APPROVED → ASSIGNED → IN_PROGRESS → COMPLETED
- WORK_BEING_REASSIGNED (when worker unable to complete)

### Tasks
- ASSIGNED → ACCEPTED → IN_PROGRESS → COMPLETED/UNABLE

### Feedback
- OPEN → IN_PROGRESS → RESOLVED/REJECTED

### Issues
- PENDING → IN_REVIEW → RESOLVED/REJECTED

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup Instructions

```bash
# Clone repository
git clone https://github.com/sanjayC2525/garbage-management-system.git
cd garbage-management-system

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Setup environment
cd backend
cp .env.example .env
# Edit .env with your configuration

# Setup database
npx prisma migrate dev
npx prisma db:seed

# Start development servers
cd ..
npm run dev
```

### Access Points
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

### Demo Accounts
- Admin: admin@example.com
- Workers: worker1@example.com, worker2@example.com, worker3@example.com
- Citizen: citizen@example.com

## API Endpoints

### Authentication
- POST /auth/login - User login
- POST /auth/register - User registration

### Garbage Reports
- GET /garbage-reports - Get user reports
- POST /garbage-reports - Submit new report
- PUT /garbage-reports/:id/approve - Approve report

### Tasks
- GET /tasks - Get assigned tasks
- PUT /tasks/:id/accept - Accept task
- PUT /tasks/:id/complete - Complete task

### Feedback
- GET /feedback - Get feedback submissions
- POST /feedback - Submit feedback with AI analysis
- GET /feedback/stats - Get feedback statistics

### Issues
- GET /issues/issues-feedback/admin - Get all issues and feedback
- POST /issues/issues-feedback - Submit issue or feedback

## Security Considerations

### Current Implementation
- JWT token-based authentication
- Role-based access control
- File upload validation
- Input sanitization
- CORS configuration

### Development Notes
- Uses localStorage for tokens (development only)
- Console logging in development mode
- SQLite database for development
- Environment variable configuration

## Contributing

### Development Guidelines
- Follow existing code style and patterns
- Add error handling for new features
- Test all role-based functionality
- Update documentation for API changes

### Areas for Enhancement
- WebSocket real-time updates
- Advanced analytics features
- Mobile optimization
- Security hardening
- Performance optimization
- Production database migration

## License

This project is for demonstration and educational purposes.

---

Built with React, Node.js, Prisma, and AI content moderation technology.