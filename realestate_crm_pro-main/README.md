# Real Estate CRM Pro

A modern, comprehensive Real Estate Customer Relationship Management system built with React 18, featuring advanced lead management, opportunity tracking, user management, and analytics reporting.

## 🚀 Features

### Core CRM Features
- **User Management** - Role-based access control with admin, project manager, and sales agent roles
- **Lead Management** - Comprehensive lead tracking and conversion pipeline
- **Opportunity Management** - Sales pipeline with customizable stages and forecasting
- **Analytics & Reporting** - Real-time dashboards with KPI tracking and custom reports
- **Campaign Management** - WhatsApp and email campaign automation
- **Site Visit Scheduling** - Integrated calendar and appointment booking system

### Technical Features
- **React 18** - Modern React with improved rendering and concurrent features
- **Authentication & Authorization** - Secure login system with role-based access control
- **API Integration** - RESTful API integration with error handling and loading states
- **Real-time Notifications** - Toast notifications and activity logging
- **File Upload System** - Drag-and-drop file uploads with validation
- **Internationalization (i18n)** - Multi-language support with react-i18next
- **Responsive Design** - Mobile-first design with TailwindCSS
- **Progressive Web App** - Offline-capable with PWA features

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6, Redux Toolkit
- **Styling**: TailwindCSS with custom design system
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: Redux Toolkit for complex state, Context API for auth/notifications
- **API Client**: Axios with request/response interceptors
- **Testing**: Jest and React Testing Library
- **Analytics**: D3.js and Recharts for data visualization
- **Forms**: React Hook Form for efficient form handling
- **Animation**: Framer Motion for smooth UI interactions

## 📋 Prerequisites

- Node.js (v16.x or higher)
- npm or yarn package manager
- Modern web browser with ES6+ support

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nareshkhatri786/realestate_crm_pro-main.git
   cd realestate_crm_pro-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**:
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**:
   Navigate to `http://localhost:4028`

## 📁 Project Structure

```
src/
├── api/                    # API service layer
│   ├── apiClient.js       # Axios client with interceptors
│   ├── usersApi.js        # Users API endpoints
│   └── index.js           # API exports
├── auth/                   # Authentication system
│   ├── AuthContext.jsx    # Auth context and provider
│   ├── Login.jsx          # Login component
│   ├── Logout.jsx         # Logout component
│   ├── ProtectedRoute.jsx # Route protection
│   └── index.js           # Auth exports
├── components/             # Reusable UI components
│   ├── ui/                # Core UI components
│   │   ├── Button.jsx
│   │   ├── Header.jsx
│   │   ├── FileUpload.jsx
│   │   └── ...
│   ├── AppIcon.jsx        # Icon component
│   ├── AppImage.jsx       # Image component
│   └── ErrorBoundary.jsx  # Error boundary
├── i18n/                  # Internationalization
│   ├── locales/           # Translation files
│   │   └── en.json        # English translations
│   └── index.js           # i18n configuration
├── notifications/         # Notification system
│   ├── NotificationContext.jsx  # Notification provider
│   ├── NotificationContainer.jsx # Toast notifications
│   ├── ActivityLog.jsx    # Activity log component
│   └── index.js           # Notification exports
├── pages/                 # Page components
│   ├── dashboard/         # Dashboard page
│   ├── user-management/   # User management
│   ├── leads-management/  # Lead management
│   ├── opportunities-management/ # Opportunity tracking
│   ├── analytics-reports/ # Analytics and reporting
│   ├── site-visits-scheduler/ # Appointment scheduling
│   ├── whats-app-campaign-management/ # Campaign management
│   └── NotFound.jsx       # 404 page
├── styles/                # Global styles and Tailwind config
├── App.jsx                # Main application component
├── Routes.jsx             # Application routing
└── index.jsx              # Application entry point
```

## 🔐 Authentication & Authorization

The application implements a comprehensive authentication system with:

- **Role-based Access Control**: Admin, Project Manager, Sales Agent roles
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Session Management**: Persistent login with localStorage
- **Authorization Context**: Global auth state management

### Default Login (Demo)
- **Email**: Any valid email address
- **Password**: Any password
- **Note**: Currently using mock authentication for demo purposes

## 🔧 API Integration

The application features a robust API integration layer:

- **Centralized API Client**: Axios-based client with interceptors
- **Error Handling**: Standardized error responses and user feedback
- **Loading States**: Built-in loading indicators for all API calls
- **Request/Response Logging**: Development-friendly API debugging

### Current API Integration
- **Users Management**: Integrated with JSONPlaceholder API for demonstration
- **Real-time Data**: Live API calls replace previous mock data
- **Error Fallbacks**: Graceful degradation when APIs are unavailable

## 📱 Responsive Design & Mobile Support

- **Mobile-First Approach**: Optimized for mobile devices
- **Responsive Layouts**: Adaptive layouts for all screen sizes
- **Touch-Friendly**: Optimized for touch interactions
- **Progressive Web App**: Installable app experience

## 🌐 Internationalization (i18n)

- **Multi-language Support**: Ready for multiple languages
- **React i18next**: Professional i18n framework integration
- **Organized Translations**: Feature-based translation organization
- **Extensible**: Easy addition of new languages

## 🔔 Notifications & Activity Tracking

- **Toast Notifications**: Success, error, warning, and info notifications
- **Activity Log**: Real-time activity tracking across the application
- **Notification Context**: Global notification state management
- **Auto-dismiss**: Configurable auto-dismiss timers

## 📄 File Upload System

- **Drag & Drop**: Intuitive file upload interface
- **File Validation**: Size, type, and quantity restrictions
- **Progress Tracking**: Real-time upload progress indicators
- **Error Handling**: Detailed validation error messages

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## 🚀 Building for Production

Create a production build:

```bash
npm run build
# or
yarn run build
```

## 📊 Development Roadmap

For detailed information about planned features and improvements, see [docs/roadmap.md](docs/roadmap.md).

### Upcoming Features
- Multi-factor Authentication (MFA)
- Advanced lead scoring algorithms
- Visual pipeline management with drag-and-drop
- Integrated communication hub (WhatsApp, SMS, Email)
- Custom dashboard builder
- Mobile applications (React Native)

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow the established code style and conventions
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure responsive design compatibility
- Test across different browsers and devices

### Code Style
- Use ESLint and Prettier for code formatting
- Follow React best practices and hooks guidelines
- Maintain consistent naming conventions
- Write clear, self-documenting code

## 📞 Support & Documentation

- **Documentation**: Comprehensive guides in the `/docs` folder
- **Issue Tracking**: Use GitHub Issues for bug reports and feature requests
- **Community**: Join our developer community for discussions
- **Support**: Contact the development team for urgent issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons by [Lucide React](https://lucide.dev/)
- Powered by modern web technologies and open-source libraries

---

**Built with ❤️ for the Real Estate Industry**

*Transforming how real estate professionals manage their customer relationships and drive sales success.*
