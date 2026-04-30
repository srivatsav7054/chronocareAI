# 🚀 ChronoCare AI - Complete Setup Guide

## Step-by-Step Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Git (optional, for version control)

### Installation Steps

#### Step 1: Navigate to Project Directory
```bash
cd chronocare-ai
```

#### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- react & react-dom
- react-router-dom (routing)
- framer-motion (animations)
- recharts (charts)
- axios (API calls)
- tailwindcss (styling)
- lucide-react (icons)

#### Step 3: Start Development Server
```bash
npm run dev
```

You should see output like:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
```

#### Step 4: Open in Browser
Visit `http://localhost:5173` in your browser

#### Step 5: Login with Demo Credentials
- **Email**: demo@example.com
- **Password**: any password

---

## 📁 File Structure Explanation

### Root Files
- `package.json` - Project dependencies and scripts
- `vite.config.js` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - PostCSS plugins for CSS processing
- `index.html` - HTML entry point
- `.gitignore` - Git ignore rules
- `README.md` - Project documentation

### src/App.jsx
Main application component with:
- BrowserRouter setup
- Route configuration
- Auth context provider
- Protected routes

### src/main.jsx
React DOM entry point - mounts App to #root element

### src/index.css
Global styles with:
- Tailwind directives
- Custom CSS classes (glass-card, gradient-text, etc.)
- Scrollbar styling
- Smooth transitions

### src/context/AuthContext.jsx
Authentication state management:
- Login/logout functions
- User data storage
- Auth state context

### src/components/

**Navbar.jsx**
- Sidebar navigation with icons
- Active page highlighting
- Smooth animations
- Logout button

**ProtectedRoute.jsx**
- Route protection wrapper
- Redirects to login if not authenticated

**CircularHealthScore.jsx**
- Animated SVG circle
- Dynamic color based on score
- Smooth stroke animation

**StatCard.jsx**
- Reusable stat display card
- Icon support
- Hover animations
- Gradient backgrounds

**RecentReports.jsx**
- List of recent medical reports
- Status badges
- Report type icons
- Hover effects

### src/pages/

**Login.jsx**
- Email/password form
- Error handling
- Loading states
- Demo credentials display
- Form validation

**Dashboard.jsx**
- Welcome message
- Health score circle
- Statistics grid
- Trend chart with Recharts
- Health info sections
- Recent reports

**Timeline.jsx**
- Vertical animated timeline
- Expandable event cards
- Color-coded event types
- Timeline statistics
- Date formatting

**Upload.jsx**
- Drag-and-drop file upload
- Text area input
- File preview
- Processing animation
- Success message
- File format information

**Emergency.jsx**
- Large emergency button
- Full-screen modal display
- Blood group information
- Allergies with warnings
- Chronic conditions
- Current medications
- Dismissible modal

### src/data/dummyData.js
Static mock data:
- `dummyUserData` - User profile, allergies, conditions, medications
- `dummyReports` - Recent medical reports
- `dummyTimelineEvents` - Health history events
- `dummyHealthTrendData` - 7-month trend data

---

## 🛠️ Available Commands

### Development
```bash
npm run dev
```
Starts Vite development server with hot module replacement

### Build
```bash
npm run build
```
Creates optimized production build in `dist/` folder

### Preview
```bash
npm run preview
```
Previews production build locally

---

## 🎨 Customization Guide

### Change App Colors

**Edit `src/index.css`:**
```css
body {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

**Edit `tailwind.config.js`:**
```javascript
colors: {
  primary: {
    500: '#YOUR_CUSTOM_COLOR',
  },
}
```

### Modify Dummy Data

**Edit `src/data/dummyData.js`:**
```javascript
export const dummyUserData = {
  name: "Your Name",
  email: "your@email.com",
  bloodGroup: "AB+",
  // ... more fields
};
```

### Add New Pages

1. Create `src/pages/NewPage.jsx`:
```javascript
import React from 'react';
import { Navbar } from '../components/Navbar';

export const NewPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <Navbar />
      <main className="ml-64 p-8">
        {/* Your content */}
      </main>
    </div>
  );
};
```

2. Add route in `src/App.jsx`:
```javascript
<Route
  path="/newpage"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>
```

3. Add nav item in `src/components/Navbar.jsx`:
```javascript
{ path: '/newpage', label: 'New Page', icon: YourIcon },
```

### Connect to Backend API

Replace mock data with API calls in any page:

```javascript
import axios from 'axios';

const API_BASE_URL = 'https://your-api.com';

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  fetchData();
}, []);
```

---

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
# Kill the process or specify a different port
npm run dev -- --port 3000
```

### Modules Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Classes Not Applying
- Ensure file paths in `tailwind.config.js` are correct
- Run `npm run dev` again
- Clear browser cache (Ctrl+Shift+Delete)

### Animations Not Smooth
- Check browser performance (Chrome DevTools → Performance)
- Reduce animation duration for older devices
- Use GPU acceleration: `will-change: transform`

---

## 📦 Deployment Guides

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your GitHub repository
5. Framework: Vite
6. Deploy!

**Vercel Config (optional `vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Go to https://netlify.com
3. Drag and drop the `dist` folder
4. Or connect GitHub for auto-deployment

**Netlify Config (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deploy to GitHub Pages

```bash
# Update vite.config.js base path
# base: '/repository-name/',

npm run build

# Create gh-pages branch and deploy
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

### Docker Deployment

**Create `Dockerfile`:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Create `nginx.conf`:**
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

**Build and run:**
```bash
docker build -t chronocare-ai .
docker run -p 80:80 chronocare-ai
```

---

## 🔐 Security Considerations

### Before Production
1. ✅ Replace dummy authentication with real OAuth/JWT
2. ✅ Use environment variables for API endpoints:
```javascript
// .env.local (create this file)
VITE_API_URL=https://your-api.com
VITE_API_KEY=your-secret-key
```

Access in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

3. ✅ Enable HTTPS for all API calls
4. ✅ Add proper error boundary handling
5. ✅ Implement proper session management
6. ✅ Add CSRF protection
7. ✅ Sanitize user inputs

### Environment Variables
```bash
# .env.local (don't commit this file!)
VITE_API_URL=https://api.chronocare.com
VITE_API_KEY=your-api-key
VITE_APP_NAME=ChronoCare AI
```

---

## 📊 Performance Optimization

### Implemented
- Code splitting with React Router
- Smooth 60fps animations
- Optimized image rendering
- CSS utility optimization with Tailwind

### Additional Steps
```javascript
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./pages/Heavy'));

// Use in JSX
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### Production Build
```bash
npm run build

# Check build size
npm install -g serve
serve -s dist
```

---

## 🎯 Next Steps for Hackathon

1. ✅ Setup complete!
2. 📱 Test on mobile devices
3. 🔗 Connect to your backend API
4. 🎨 Customize colors and branding
5. ✨ Add your own features
6. 🧪 Test all pages and interactions
7. 📤 Deploy to Vercel/Netlify
8. 🎉 Submit to hackathon!

---

## 📞 Support & Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Recharts**: https://recharts.org/
- **React Router**: https://reactrouter.com/
- **Vite**: https://vitejs.dev/

---

**Good luck with your hackathon! 🚀**
