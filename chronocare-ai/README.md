# ChronoCare AI - Lifelong Health Intelligence System

A modern, interactive React-based frontend for a comprehensive health management platform built for hackathons.

## 🎨 Features

✨ **Modern Design**
- Blue/Indigo gradient theme with glassmorphism cards
- Smooth Framer Motion animations
- Fully responsive design
- Professional and eye-catching UI

📱 **Core Pages**
1. **Login Page** - Clean authentication interface with demo credentials
2. **Dashboard** - Health overview with circular score indicator, stats, and trends
3. **Health Timeline** - Interactive lifelong health events visualization
4. **Upload Reports** - Medical document upload with AI explanation (mocked)
5. **Emergency Mode** - Full-screen critical health information display

🔐 **Features**
- Protected routes with authentication context
- Sidebar navigation with smooth animations
- Health trend charts with Recharts
- Drag-and-drop file upload
- Interactive timeline with expandable events
- Circular health score visualization
- Emergency mode with critical health data

## 📁 Project Structure

```
chronocare-ai/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                 # Sidebar navigation
│   │   ├── ProtectedRoute.jsx         # Route protection wrapper
│   │   ├── CircularHealthScore.jsx    # Animated health score circle
│   │   ├── StatCard.jsx               # Statistics card component
│   │   └── RecentReports.jsx          # Recent reports section
│   ├── context/
│   │   └── AuthContext.jsx            # Authentication state management
│   ├── data/
│   │   └── dummyData.js               # Mock data for all pages
│   ├── pages/
│   │   ├── Login.jsx                  # Login page
│   │   ├── Dashboard.jsx              # Main dashboard
│   │   ├── Timeline.jsx               # Health timeline
│   │   ├── Upload.jsx                 # Upload reports page
│   │   └── Emergency.jsx              # Emergency mode
│   ├── App.jsx                        # Main app with routing
│   ├── main.jsx                       # React DOM entry
│   └── index.css                      # Global styles
├── index.html                         # HTML entry point
├── package.json                       # Dependencies
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind CSS config
├── postcss.config.js                  # PostCSS config
└── .gitignore                         # Git ignore rules
```

## 🚀 Quick Start

### 1. Create Project & Install Dependencies

```bash
# Clone or download the project
cd chronocare-ai

# Install dependencies
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## 🔑 Demo Credentials

```
Email: demo@example.com
Password: any password
```

## 📦 Dependencies

### Core
- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool

### Styling & Design
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Data & Charts
- **Recharts** - Chart visualization
- **Axios** - HTTP client (ready for API integration)

## 🎯 Key Features Breakdown

### 1. Login Page
- Modern form design with icons
- Email and password validation
- Demo credentials display
- Smooth animations on load
- Error message handling

### 2. Dashboard
- Circular health score indicator with animation
- Quick statistics cards (Allergies, Conditions, Medications)
- Health trend chart showing 7-month progression
- Recent reports section with status badges
- Allergies and conditions display
- Responsive grid layout

### 3. Health Timeline
- Vertical animated timeline with color-coded events
- Expandable event cards with descriptions
- Different icons for different event types
- Timeline statistics
- Smooth scroll animations
- Event type filtering visualization

### 4. Upload Reports
- Drag-and-drop file upload area
- Text input for report description
- AI explanation button (mocked with loading state)
- File type support display
- Success animation on completion
- Form validation

### 5. Emergency Mode
- Large red emergency activation button
- Full-screen modal with critical information
- Blood group display
- Allergies (with warnings)
- Chronic conditions
- Current medications with dosages
- Responsive grid layout
- Smooth animations

## 🎨 Design System

### Colors
- **Primary**: Indigo/Purple gradient (#667eea → #764ba2)
- **Glass**: White with 10% opacity + 10px blur
- **Accents**: Red (emergency), Green (approved), Orange (warnings)

### Components
- **Glass Cards**: Semi-transparent cards with backdrop blur
- **Gradient Text**: Text with gradient fill
- **Smooth Transitions**: 300ms cubic-bezier animations
- **Button Glow**: Glowing effect on interactive elements

## 🔄 API Integration Ready

Replace dummy data in `src/data/dummyData.js` with actual API calls using Axios:

```javascript
import axios from 'axios';

const API_BASE_URL = 'your-api-url';

export const fetchUserData = async () => {
  const response = await axios.get(`${API_BASE_URL}/user`);
  return response.data;
};
```

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive grid layouts
- Sidebar becomes collapsible on small screens (can be enhanced)
- Touch-friendly button sizes
- Optimized for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist folder to Vercel
```

### Netlify
```bash
npm run build
# Drag dist folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🎓 Customization

### Change Theme Colors
Edit `tailwind.config.js` to customize the gradient and colors:
```javascript
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%),
```

### Add More Pages
1. Create new file in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/Navbar.jsx`

### Connect to Backend
Replace function calls in `src/pages/*.jsx` with API calls using Axios

## 📝 Notes for Hackathon

- All data is currently mocked (static)
- Ready for backend integration
- Responsive and production-ready
- Comprehensive error handling included
- Accessibility friendly
- Performance optimized with React.memo and lazy loading ready

## 🤝 Contributing

For hackathon improvements:
1. Create feature branches
2. Keep components modular
3. Use existing design patterns
4. Test on mobile devices
5. Document any new dependencies

## 📄 License

MIT License - Free for hackathon use

---

**Built with ❤️ for Modern Healthcare Technology**
