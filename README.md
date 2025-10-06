# Mini Project Manager

A full-stack project management web application built with Next.js, MongoDB, and Redux Toolkit. This application allows users to manage projects and tasks with authentication, filtering, and sorting capabilities.

## Features

### Authentication
- User registration and login with email/password
- JWT-based authentication with secure cookies
- Protected routes and API endpoints
- Automatic session management

### Project Management
- Create, read, update, and delete projects
- Each project has a title and description
- User-specific project isolation
- Project selection for task management

### Task Management
- Create, read, update, and delete tasks
- Task attributes: title, description, status, due date, and project association
- Task status options: `todo`, `in-progress`, `done`
- Filter tasks by project and status
- Sort tasks by creation date, due date, or status
- Real-time status updates

### User Interface
- Modern, responsive design with Tailwind CSS
- Intuitive dashboard with tabbed navigation
- Modal-based forms for creating/editing projects and tasks
- Loading states and error handling
- Mobile-friendly interface

## Tech Stack

- **Frontend**: React 18, Next.js 15, TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- npm or yarn package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd thewebplant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/project-manager
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/project-manager

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js
NEXTAUTH_URL=http://localhost:3000
```

**Important**: Replace `your-super-secret-jwt-key-here` with a strong, random secret key for JWT signing.

### 4. Database Setup

#### Option A: Local MongoDB
1. Install and start MongoDB locally
2. The application will automatically create the database and collections

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string and update `MONGODB_URI` in `.env.local`
4. Whitelist your IP address in MongoDB Atlas

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get specific project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Tasks
- `GET /api/tasks` - Get tasks (supports query parameters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

#### Task Query Parameters
- `projectId` - Filter by project ID
- `status` - Filter by task status
- `sortBy` - Sort by field (createdAt, dueDate, status)
- `sortOrder` - Sort order (asc, desc)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication page
│   ├── dashboard/         # Main dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── projects/          # Project-related components
│   ├── tasks/             # Task-related components
│   └── providers/         # Context providers
├── features/              # Redux slices
│   ├── auth/              # Authentication state
│   ├── projects/          # Projects state
│   └── tasks/             # Tasks state
├── lib/                   # Utility libraries
│   ├── hooks.ts           # Typed Redux hooks
│   ├── jwt.ts             # JWT utilities
│   ├── mongodb.ts         # Database connection
│   └── store.ts           # Redux store configuration
├── middleware/            # Custom middleware
│   └── auth.ts            # Authentication middleware
└── models/                # Mongoose models
    ├── User.ts            # User model
    ├── Project.ts         # Project model
    └── Task.ts            # Task model
```

## Key Implementation Details

### Authentication Flow
1. Users sign up or log in through the authentication form
2. JWT tokens are generated and stored in HTTP-only cookies
3. Protected routes check for valid tokens
4. API middleware validates tokens for protected endpoints

### State Management
- Redux Toolkit provides centralized state management
- Separate slices for authentication, projects, and tasks
- Async thunks handle API calls with loading states
- Optimistic updates for better user experience

### Database Design
- **Users**: Store user credentials and profile information
- **Projects**: User-specific projects with title and description
- **Tasks**: Belong to projects with status, due date, and user association

### Security Features
- Password hashing with bcrypt
- JWT token expiration and validation
- HTTP-only cookies for token storage
- Input validation with Zod schemas
- Protected API routes

## Development Notes

### Code Organization
- Components are organized by feature (auth, projects, tasks)
- Reusable components follow DRY principles
- TypeScript provides type safety throughout
- Consistent naming conventions and file structure

### Error Handling
- Global error handling in Redux slices
- User-friendly error messages
- Loading states for better UX
- Form validation with real-time feedback

### Performance Considerations
- Optimized database queries with proper indexing
- Client-side caching with Redux
- Lazy loading and code splitting
- Responsive design for all screen sizes

## Deployment

### Environment Variables for Production
Make sure to set the following environment variables in your production environment:

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

### Build Commands
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.