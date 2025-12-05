# Team Ops Dashboard

A comprehensive enterprise-grade team operations management system built with modern web technologies. This dashboard provides role-based access control for managing employees, tasks, teams, and operational metrics with real-time notifications and advanced reporting capabilities.

## 🚀 About the Project

Team Ops Dashboard is a full-featured management platform designed for organizations to streamline their operations. The system supports three user roles (Admin, Manager, and Employee), each with tailored views and permissions. It features real-time updates via WebSockets, advanced data visualization, PDF/CSV export capabilities, and a robust authentication system.

### Key Features

- **Role-Based Dashboard**: Different views and metrics for Admin, Manager, and Employee roles
- **Employee Management**: Comprehensive employee directory with profile management
- **Task Tracking**: Create, assign, and monitor tasks with status tracking
- **Team Management**: Organize and manage teams with member assignments
- **Activity Logs**: Detailed audit trail for system activities (Admin only)
- **Real-Time Notifications**: WebSocket-based notification system
- **Advanced Reporting**: PDF generation with custom templates and CSV exports
- **Rich Text Editor**: Support for formatted content in tasks and descriptions
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 🏗️ Architecture & Design Patterns

### Project Structure

The project follows a **feature-based architecture** with clear separation of concerns:

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard feature module
│   ├── login/            # Authentication feature
│   └── signup/           # Registration feature
├── core/                  # Core functionality (framework-agnostic)
│   ├── api/              # HTTP client and interceptors
│   ├── components/       # Core UI components
│   ├── hooks/            # Reusable React hooks
│   ├── pdf/              # PDF generation system
│   ├── providers/        # React Context providers
│   └── services/         # Core business services
└── shared/               # Shared utilities and types
    ├── components/       # Reusable UI components
    └── types/            # TypeScript type definitions
```

### Design Patterns

#### 1. **Feature-Sliced Design**
Each feature module (`dashboard/employees`, `dashboard/tasks`, etc.) contains:
- `page.tsx` - Route component
- `_components/` - Feature-specific components (private)
- `_hooks/` - Feature-specific hooks
- `_schemas/` - Zod validation schemas
- `_services/` - API service layer

#### 2. **Provider Pattern**
Centralized state management using React Context:
- `AuthProvider` - Authentication state and user management
- `AppProvider` - Global application state and configuration

#### 3. **Custom Hooks Pattern**
Reusable logic encapsulated in custom hooks:
- `useAuth` - Authentication state and methods
- `useMetrics` - Dashboard metrics with React Query
- `useNotifications` - Real-time notification management
- `usePDFDownload` - PDF generation and download
- `useCSVDownload` - CSV export functionality

#### 4. **Service Layer Pattern**
Business logic separated from UI components:
- `auth.service.ts` - Authentication operations
- `io.service.ts` - WebSocket connection management
- `pdf.service.ts` - PDF generation orchestration
- `storage.service.ts` - Local storage abstraction

#### 5. **Interceptor Pattern**
HTTP request/response pipeline:
- `auth.interceptor.ts` - Automatic token injection
- `error.interceptor.ts` - Centralized error handling

#### 6. **Repository Pattern**
Data access layer with HTTP abstraction:
```typescript
class Http {
  get<T>(url: string, options?: RequestConfig): Promise<T>
  post<T>(url: string, data?: unknown, options?: RequestConfig): Promise<T>
  put<T>(url: string, data?: unknown, options?: RequestConfig): Promise<T>
  delete<T>(url: string, options?: RequestConfig): Promise<T>
}
```

#### 7. **Component Composition**
Reusable UI components built with composition in mind:
- Compound components (e.g., `Card`, `CardHeader`, `CardContent`)
- Render props for flexible rendering
- Slot-based composition for layouts

## 🛠️ Technologies & Libraries

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5** - Type-safe development

### State Management & Data Fetching
- **React Query** (@tanstack/react-query) - Server state management, caching, and synchronization
- **React Context** - Global state management
- **React Hook Form** - Form state management with performance optimization

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **clsx** - Conditional className utility
- **Recharts** - Data visualization and charts

### API & Communication
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time WebSocket communication
- **JWT Decode** - Token parsing and validation

### Form Validation
- **Zod 4** - TypeScript-first schema validation
- **@hookform/resolvers** - React Hook Form integration

### Rich Text Editing
- **Draft.js** - Rich text editor framework
- **React Draft WYSIWYG** - WYSIWYG editor component
- **draftjs-to-html** - Draft.js content conversion

### PDF Generation
- **@react-pdf/renderer** - React components for PDF generation
- Custom template system with reusable components
- Advanced page break handling and layout control

### Toast Notifications
- **Sonner** - Toast notification system

### Development Tools
- **ESLint 9** - Code linting
- **PostCSS** - CSS processing

## 📋 Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/franciscothiago0111/team-ops-dashboard.git
cd team-ops-dashboard
```

2. Install dependencies:
```bash
yarn install
```

3. Configure environment variables:
Create a `.env.local` file based on your backend API:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

4. Run the development server:
```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🔐 Authentication & Authorization

The application uses **JWT-based authentication** with role-based access control:

- **Public Routes**: `/login`, `/signup`
- **Protected Routes**: `/dashboard/*` (requires authentication)
- **Role-Based Access**: Components and routes filtered by user role

Authentication flow:
1. User logs in → JWT token received
2. Token stored in localStorage
3. Auth interceptor adds token to all requests
4. AuthProvider manages user state
5. WebSocket connection authenticated with token

## 📊 Dashboard Features by Role

### Admin
- Complete system metrics and analytics
- User management (employees)
- Team management
- Task overview across all teams
- System activity logs
- All notifications

### Manager
- Team-specific metrics
- Employee management within teams
- Task assignment and tracking
- Team notifications

### Employee
- Personal task list
- Individual performance metrics
- Personal notifications
- Task status updates

## 📄 PDF Generation System

The project includes a sophisticated PDF generation system with:

- **Template Registry**: Reusable PDF templates
- **Component Library**: Styled PDF components (Headers, Tables, Charts)
- **Page Break Control**: Advanced pagination handling
- **Custom Styling**: Theme-based styling system
- **Type Safety**: Full TypeScript support

See [src/core/pdf/TEMPLATES_USAGE.md](src/core/pdf/TEMPLATES_USAGE.md) for detailed documentation.

## 🔔 Real-Time Notifications

WebSocket integration provides:
- Instant notification delivery
- Connection state management
- Automatic reconnection
- Event-based communication

## 🧪 Code Quality

- **TypeScript Strict Mode**: Full type safety
- **ESLint Configuration**: Code consistency
- **Component Testing**: Test utilities included
- **Error Boundaries**: Graceful error handling

## 📦 Build & Deployment

Build the application:
```bash
yarn build
```

The optimized production build will be created in the `.next` directory.

Deploy to Vercel (recommended):
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/franciscothiago0111/team-ops-dashboard)

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and patterns.

## 📝 License

This project is public

## 👨‍💻 Author

**Francisco Thiago**
- GitHub: [@franciscothiago0111](https://github.com/franciscothiago0111)
# team-ops-dashboard
