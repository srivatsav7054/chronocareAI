# ❓ ChronoCare AI - FAQ & Troubleshooting

## ⚡ Quick Answers

### Q: How do I start the project?
**A:** 
```bash
cd chronocare-ai
npm install
npm run dev
# Visit http://localhost:5173
```

### Q: What are the demo credentials?
**A:** 
```
Email: demo@example.com
Password: any password
```

### Q: How do I change colors?
**A:** Edit `src/index.css` and change the gradient colors in the `body` selector.

### Q: How do I customize the data?
**A:** Edit `src/data/dummyData.js` with your own data.

### Q: Can I use this for my hackathon?
**A:** Yes! It's designed specifically for hackathons. MIT License - free to use.

### Q: How do I add more pages?
**A:** Create file in `src/pages/`, add route in `src/App.jsx`, add nav item in `Navbar.jsx`.

### Q: How do I deploy?
**A:** Push to GitHub, go to vercel.com, select repo, click Deploy. Done! ✨

---

## 🐛 Common Issues & Solutions

### Issue 1: "Port 5173 is already in use"

**Error Message:**
```
EADDRINUSE: address already in use :::5173
```

**Solutions**:
```bash
# Option 1: Use different port
npm run dev -- --port 3000

# Option 2: Kill the process (macOS/Linux)
lsof -ti:5173 | xargs kill -9

# Option 3: Restart computer or wait a moment
```

**Explanation**: Another process is using port 5173. Either change the port or stop that process.

---

### Issue 2: "Module not found" errors

**Error Message**:
```
Module not found: Can't resolve 'react'
or
Error: Cannot find module 'tailwindcss'
```

**Solutions**:
```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or use npm cache clean
npm cache clean --force
npm install
```

**Explanation**: Corrupted node_modules folder. Reinstalling fixes it.

---

### Issue 3: Tailwind classes not applying

**Symptoms**: Classes like `bg-indigo-500` don't work

**Solutions**:
1. Make sure `npm run dev` is running
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)
4. Check file paths in `tailwind.config.js`:
   ```javascript
   content: [
     "./index.html",
     "./src/**/*.{js,jsx,ts,tsx}",  // Make sure this is correct
   ]
   ```

**Explanation**: Tailwind needs to scan your files to generate CSS.

---

### Issue 4: Animations not smooth

**Symptoms**: Animations are choppy or laggy

**Solutions**:
```bash
# Open Chrome DevTools → Performance
# Record and analyze the performance

# Reduce animation duration in components
transition={{ duration: 0.5 }}  // was 0.8

# Add GPU acceleration
style={{ transform: 'translateZ(0)' }}
```

**Explanation**: Animation performance depends on system specs and browser.

---

### Issue 5: "useAuth must be used within AuthProvider"

**Error Message**:
```
Error: useAuth must be used within AuthProvider
```

**Solution**: This error is already handled in the code. Just ensure:
- App.jsx wraps AuthProvider correctly
- Your component imports useAuth correctly

**Explanation**: AuthProvider needs to wrap all components that use useAuth.

---

### Issue 6: Images/Icons not showing

**Symptoms**: Icons from lucide-react don't appear

**Solutions**:
```bash
# Reinstall lucide-react
npm install lucide-react

# Check import is correct
import { Heart } from 'lucide-react';  // Correct ✓
import Heart from 'lucide-react';     // Wrong ✗
```

**Explanation**: Icon library needs proper imports.

---

### Issue 7: Routes not working / can't navigate

**Error**: Clicking nav items doesn't change page

**Solutions**:
1. Check router setup in App.jsx
2. Ensure all pages are exported correctly
3. Try hard refresh (Ctrl+Shift+R)
4. Clear browser local storage:
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

**Explanation**: Router needs proper configuration and page exports.

---

### Issue 8: Localhost not accessible

**Error**: "Cannot GET http://localhost:5173"

**Solutions**:
1. Check terminal output - server might not be running
2. Stop and restart: `npm run dev`
3. Check for error messages in terminal
4. Verify node_modules installed: `ls node_modules`

**Explanation**: Development server not started properly.

---

### Issue 9: Login not working / stuck on login page

**Symptoms**: Login button doesn't work, can't access dashboard

**Solutions**:
```javascript
// Use correct demo credentials
Email: demo@example.com  // ✓ Correct
Password: any password   // ✓ Any password works

// Check AuthContext in browser DevTools
// Make sure login function is being called
```

**Explanation**: Demo auth accepts any non-empty email/password.

---

### Issue 10: File upload doesn't work

**Error**: Drag-drop doesn't respond

**Solutions**:
1. Check browser console for errors
2. Ensure you're on `/upload` route
3. Make sure you're logged in (protected route)
4. Try different file types
5. Check file size

**Explanation**: Upload is mocked - doesn't actually send to server. Button should still work.

---

## 💡 Performance Tips

### Optimization Checklist
- ✅ Run `npm run build` for production
- ✅ Check bundle size: `npm install -g serve && serve -s dist`
- ✅ Use Lighthouse in Chrome DevTools
- ✅ Lazy load heavy components
- ✅ Optimize images if adding them
- ✅ Remove unused dependencies
- ✅ Enable gzip compression on server

### Bundle Size
```bash
# Analyze bundle
npm run build

# Output: dist/index.js should be < 500KB
# If larger, remove unused dependencies
```

---

## 🔄 Git & Version Control

### Initialize Git
```bash
cd chronocare-ai
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/chronocare-ai.git
git push -u origin main
```

### Useful Git Commands
```bash
# View changes
git status

# Add files
git add .

# Commit
git commit -m "Description"

# Push
git push

# Create branch for feature
git checkout -b feature/new-feature
```

---

## 🔗 API Integration Guide

### Step 1: Create .env.local
```
VITE_API_URL=https://your-api.com
VITE_API_KEY=your-secret-key
```

### Step 2: Create API Service
```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUserData = async () => {
  const response = await axios.get(`${API_URL}/user`);
  return response.data;
};

export const uploadReport = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/reports`, formData);
  return response.data;
};
```

### Step 3: Use in Components
```javascript
import { fetchUserData } from '../services/api';

useEffect(() => {
  fetchUserData()
    .then(data => setUserData(data))
    .catch(err => console.error(err));
}, []);
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login with demo credentials
- [ ] Verify all 4 nav items work
- [ ] Check Dashboard loads data
- [ ] Expand timeline events
- [ ] Try file upload
- [ ] Open emergency mode
- [ ] Test on mobile device
- [ ] Check all animations
- [ ] Logout and login again

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update dummy data with real data
- [ ] Connect to real API endpoints
- [ ] Add real authentication (OAuth/JWT)
- [ ] Test all pages thoroughly
- [ ] Check mobile responsiveness
- [ ] Add error boundaries
- [ ] Set up analytics
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up environment variables
- [ ] Create deployment script
- [ ] Test production build locally
- [ ] Set up monitoring/logging
- [ ] Create rollback plan

---

## 📱 Mobile Testing

### Test Locally on Mobile
```bash
# Get your IP address
ipconfig getifaddr en0  # macOS
ipconfig | grep "IPv4"  # Windows

# Run on port 5173 accessible from LAN
npm run dev -- --host 0.0.0.0

# Access from mobile
http://YOUR_IP:5173
```

### Responsive Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

All pages use these breakpoints via Tailwind.

---

## 🔒 Security Notes

### Current (Development)
- ✅ Dummy auth for testing only
- ✅ No real data stored
- ✅ Client-side validation only

### Before Production
- ⚠️ Implement real authentication (OAuth, JWT)
- ⚠️ Add server-side validation
- ⚠️ Use HTTPS only
- ⚠️ Sanitize user inputs
- ⚠️ Add rate limiting
- ⚠️ Implement CORS properly
- ⚠️ Use secure headers
- ⚠️ Add encryption for sensitive data
- ⚠️ Implement logout/session management

---

## 📚 Learning Resources

### React
- [React Documentation](https://react.dev)
- [React Hooks](https://react.dev/reference/react)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com)
- [Component Examples](https://tailwindui.com)

### Framer Motion
- [Framer Motion Docs](https://www.framer.com/motion)
- [Animation Examples](https://www.framer.com/motion/examples)

### Other
- [Vite Guide](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)

---

## 💬 Getting Help

### Debugging Steps
1. Check browser console (F12)
2. Look at terminal output
3. Check React DevTools
4. Read error messages carefully
5. Search error on Google
6. Check GitHub issues
7. Ask on Stack Overflow

### Useful Debugging Tools
```bash
# React DevTools (Chrome Extension)
# Install from Chrome Web Store

# VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- Thunder Client or Postman (API testing)
```

---

## ❌ Common Mistakes

### ❌ Mistake 1: Not installing dependencies
```bash
# Wrong - this won't work
npm start

# Right - install first
npm install
npm run dev
```

### ❌ Mistake 2: Forgetting npm run dev
```bash
# You need to run the dev server
npm run dev
# Then visit http://localhost:5173
```

### ❌ Mistake 3: Modifying node_modules
```bash
# Wrong - don't edit here
src/
node_modules/  ← Don't touch!

# Right - edit source files
src/pages/
src/components/
```

### ❌ Mistake 4: Wrong import paths
```javascript
// Wrong
import Dashboard from '../pages/Dashboard'

// Right (export default)
import { Dashboard } from '../pages/Dashboard'

// Or if default export in Dashboard.jsx
import Dashboard from '../pages/Dashboard'
```

### ❌ Mistake 5: Forgetting to save files
- Always save files in editor (Ctrl+S)
- Hot reload will update automatically

---

## ✅ Best Practices

### ✅ Do This
- Use functional components
- Use hooks for state
- Keep components small
- Use proper prop types
- Comment complex code
- Test on mobile
- Use environment variables
- Commit frequently

### ❌ Don't Do This
- Use class components
- Put all code in one file
- Use inline styles
- Hardcode API URLs
- Deploy without testing
- Commit node_modules
- Use var (use const/let)
- Ignore console warnings

---

## 📞 Still Need Help?

### Common Resources
1. **README.md** - Full documentation
2. **SETUP.md** - Detailed setup guide
3. **PROJECT_INDEX.md** - Complete feature list
4. **FILE_COPYING_GUIDE.md** - File-by-file instructions

### Get Community Help
- [React Discord](https://discord.gg/react)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)
- [GitHub Discussions](https://github.com/topics/react)

---

## 🎯 Next Steps

1. ✅ Get app running locally
2. ✅ Explore all pages
3. ✅ Customize dummy data
4. ✅ Test on mobile
5. ✅ Connect to API
6. ✅ Add custom features
7. ✅ Deploy to production
8. ✅ Submit to hackathon!

---

**Last Updated**: February 13, 2026
**Status**: Production Ready
**Support**: Check README.md or SETUP.md for more info

**Good luck! 🚀**
