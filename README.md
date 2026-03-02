# ServiceHive - On-Demand Service Marketplace Platform

A modern, professional, futuristic 3D UI frontend for a MERN stack final year project similar to Urban Company + Fiverr, with real-time tracking and Stripe payments.

## 🚀 Features

### Core Functionality
- **Multi-role Platform**: Customer, Provider, and Admin dashboards
- **Service Management**: Browse, book, and manage services
- **Real-time Tracking**: Live location tracking for service providers
- **Payment Integration**: Stripe payment processing simulation
- **Review System**: Customer ratings and reviews
- **Admin Panel**: Complete admin dashboard with analytics
- **Responsive Design**: Mobile, tablet, and desktop optimized

### Technical Features
- **Modern UI**: Glassmorphism with gradient themes
- **3D Animations**: Framer Motion powered animations
- **Dark Theme**: Futuristic dark theme with neon accents
- **Component Architecture**: Reusable components and clean structure
- **Routing**: React Router DOM for navigation
- **State Management**: React hooks for state management

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: TailwindCSS with custom configurations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Architecture**: Component-based functional components

## 📁 Project Structure

```
src/
 ├── components/
 │   ├── ui/                 # Reusable UI components
 │   ├── layout/             # Layout-specific components
 │   ├── cards/             # Card components
 │   ├── charts/            # Chart components
 │   └── common/            # Common utilities
 │
 ├── layouts/
 │   ├── MainLayout.jsx       # Public pages layout
 │   └── DashboardLayout.jsx # Dashboard layout
 │
 ├── pages/
 │   ├── auth/               # Authentication pages
 │   │   ├── LoginPage.jsx
 │   │   └── RegisterPage.jsx
 │   ├── public/             # Public pages
 │   │   ├── LandingPage.jsx
 │   │   ├── AboutPage.jsx
 │   │   └── BrowseServicesPage.jsx
 │   ├── customer/           # Customer dashboard
 │   │   ├── CustomerDashboard.jsx
 │   │   ├── CustomerServiceDetails.jsx
 │   │   ├── BookingFormPage.jsx
 │   │   ├── MyBookingsPage.jsx
 │   │   ├── LiveTrackingPage.jsx
 │   │   ├── PaymentsPage.jsx
 │   │   ├── ReviewsPage.jsx
 │   │   └── CustomerProfileSettings.jsx
 │   ├── provider/           # Provider dashboard
 │   │   ├── ProviderDashboard.jsx
 │   │   ├── AddServicePage.jsx
 │   │   ├── ManageServicesPage.jsx
 │   │   ├── BookingRequestsPage.jsx
 │   │   ├── ActiveJobsPage.jsx
 │   │   ├── EarningsPage.jsx
 │   │   ├── ProviderProfilePage.jsx
 │   │   └── LiveLocationTogglePage.jsx
 │   └── admin/              # Admin dashboard
 │       ├── AdminDashboard.jsx
 │       ├── ManageUsersPage.jsx
 │       ├── ApproveProvidersPage.jsx
 │       ├── AdminManageServicesPage.jsx
 │       ├── AllBookingsPage.jsx
 │       ├── PaymentsReportsPage.jsx
 │       └── LiveMonitoringMapPage.jsx
 │
 ├── routes/
 │   └── AppRoutes.jsx       # Route configuration
 │
 ├── App.jsx                 # Main App component
 ├── main.jsx                # Entry point
 └── index.css               # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Dark theme base (#0f172a)
- **Gradients**: Cyan, Purple, Pink neon gradients
- **Glassmorphism**: Semi-transparent backgrounds with blur
- **Neon Accents**: Bright cyan, purple, pink highlights

### Components
- **GlassCard**: Glassmorphism card component
- **GradientButton**: Animated gradient buttons
- **3D Card**: Hover effects with rotation and scale
- **StatCard**: Dashboard statistics cards

### Animations
- **Page Transitions**: Smooth fade and slide animations
- **Hover Effects**: 3D transforms and scale effects
- **Loading States**: Pulse and spin animations
- **Micro-interactions**: Button and link hover states

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features
- **Mobile-first approach**
- **Collapsible navigation** for mobile
- **Touch-friendly interactions**
- **Optimized layouts** for all devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ServiceHive
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔧 Configuration

### TailwindCSS Configuration
- Custom color palette
- Extended animations
- Custom components
- Responsive breakpoints

### Vite Configuration
- React plugin
- Path aliases
- Build optimizations

## 🎯 Key Features

### Customer Dashboard
- **Service Discovery**: Browse and search services
- **Booking Management**: Book and track services
- **Payment Processing**: Secure payment simulation
- **Review System**: Rate and review services
- **Profile Management**: Personal settings and preferences

### Provider Dashboard
- **Service Management**: Create and manage services
- **Booking Requests**: Accept and manage bookings
- **Earnings Tracking**: Monitor revenue and analytics
- **Live Location**: Real-time location sharing
- **Profile Management**: Business profile and settings

### Admin Dashboard
- **User Management**: Manage all platform users
- **Service Monitoring**: Monitor all services
- **Approval System**: Approve provider applications
- **Analytics**: Comprehensive reporting and insights
- **Live Monitoring**: Real-time platform monitoring

## 🎨 UI/UX Highlights

### Visual Design
- **Modern Glassmorphism**: Frosted glass effect
- **Neon Gradients**: Vibrant color gradients
- **3D Animations**: Depth and dimension
- **Dark Theme**: Professional dark interface
- **Micro-interactions**: Smooth hover states

### User Experience
- **Intuitive Navigation**: Clear menu structures
- **Fast Performance**: Optimized rendering
- **Responsive Design**: Works on all devices
- **Accessibility**: Semantic HTML and ARIA support
- **Loading States**: Smooth loading animations

## 📊 Analytics & Reporting

### Customer Analytics
- Booking history and trends
- Spending patterns and insights
- Service preferences
- Review statistics

### Provider Analytics
- Revenue tracking and forecasts
- Service performance metrics
- Customer satisfaction scores
- Geographic demand analysis

### Admin Analytics
- Platform-wide statistics
- User growth metrics
- Financial reporting
- System performance monitoring

## 🔒 Security Features

### Authentication
- Role-based access control
- Secure login/logout
- Session management
- Password protection

### Data Protection
- Input validation
- XSS prevention
- Secure data handling
- Privacy controls

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

### Environment Variables
Create a `.env` file for configuration:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_KEY=pk_test_...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎓 Final Year Project

This project is designed as a comprehensive final year project demonstrating:
- **Full-stack development skills**
- **Modern UI/UX design**
- **Component-based architecture**
- **State management**
- **API integration patterns**
- **Responsive design**
- **Performance optimization**

## 🌟 Future Enhancements

- **Real-time notifications**
- **Advanced filtering and search**
- **Mobile app development**
- **AI-powered recommendations**
- **Advanced analytics dashboard**
- **Multi-language support**

---

**ServiceHive** - Your trusted platform for on-demand services! 🚀
