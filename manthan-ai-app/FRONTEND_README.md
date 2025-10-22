# ReSeer Frontend - Rebuilt

## 🚀 Modern React Frontend

This is the rebuilt frontend for ReSeer, featuring:

### ✨ Features
- **Modern React 18** with Vite for fast development
- **Tailwind CSS** for beautiful, responsive design
- **Dark Mode Support** with system preference detection
- **Mobile-First Design** with responsive navigation
- **Smooth Animations** with custom CSS animations
- **Error Boundaries** for better error handling
- **Loading States** and user feedback

### 🎨 Design Improvements
- **Gradient Backgrounds** and modern color schemes
- **Glass Morphism Effects** for modern UI elements
- **Hover Animations** and micro-interactions
- **Custom Icons** from Lucide React
- **Responsive Typography** with better readability
- **Accessibility Features** with proper ARIA labels

### 🛠️ Tech Stack
- **React 18** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications
- **Framer Motion** - Advanced animations (optional)

### 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Or use the batch file: `start-dev.bat`

3. **Open in Browser**
   - Navigate to `http://localhost:5173`

### 📁 Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Modern navigation with mobile menu
│   ├── UploadBox.jsx   # Enhanced file upload with drag & drop
│   ├── AnalysisResults.jsx
│   ├── GraphView.jsx
│   ├── InsightCard.jsx
│   └── SavedPaperCard.jsx
├── pages/              # Page components
│   ├── Home.jsx        # Landing page with hero section
│   └── Dashboard.jsx   # User dashboard
├── context/            # React Context providers
│   └── AuthContext.jsx
├── utils/              # Utility functions
├── App.jsx             # Main app with error boundaries
├── main.jsx            # Entry point
└── index.css           # Global styles with custom animations
```

### 🎯 Key Improvements

#### Navigation
- **Sticky Navigation** with backdrop blur
- **Mobile Menu** with smooth animations
- **Active Route Highlighting**
- **Dark Mode Toggle** with persistence
- **User Profile Display** with avatar

#### Upload Experience
- **Drag & Drop Interface** with visual feedback
- **Multiple Input Types** (PDF, DOI, ArXiv)
- **File Validation** with user-friendly messages
- **Loading States** with progress indicators
- **Error Handling** with helpful messages

#### Visual Design
- **Gradient Backgrounds** for depth
- **Card Hover Effects** for interactivity
- **Smooth Transitions** between states
- **Custom Animations** for engagement
- **Responsive Grid Layouts**

#### User Experience
- **Error Boundaries** for graceful failures
- **Loading Spinners** for async operations
- **Toast Notifications** for feedback
- **Accessibility** with proper ARIA labels
- **Keyboard Navigation** support

### 🔧 Development

#### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Environment Variables
Create a `.env` file with:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_key
```

### 🎨 Customization

#### Colors
The app uses a custom color palette defined in `index.css`:
- Primary: Blue gradient (`#3b82f6` to `#1d4ed8`)
- Secondary: Purple accent (`#8b5cf6`)
- Success: Green (`#10b981`)
- Warning: Yellow (`#f59e0b`)
- Error: Red (`#ef4444`)

#### Animations
Custom animations are defined in `index.css`:
- `animate-fade-in` - Smooth fade in
- `animate-slide-up` - Slide up with fade
- `animate-bounce-in` - Bounce entrance effect

#### Components
All components are built with:
- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Automatic theme switching
- **Accessibility** - ARIA labels and keyboard navigation
- **Performance** - Optimized rendering and lazy loading

### 🚀 Deployment

The frontend is ready for deployment to:
- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **Firebase Hosting** - Integrated with Firebase
- **GitHub Pages** - Free hosting option

### 📱 Mobile Support

The app is fully responsive with:
- **Mobile Navigation** - Collapsible menu
- **Touch Gestures** - Swipe and tap support
- **Responsive Images** - Optimized for all screen sizes
- **Mobile-First CSS** - Tailwind responsive utilities

### 🔒 Security

- **Input Validation** - Client-side validation
- **XSS Protection** - Sanitized user inputs
- **CSRF Protection** - Secure API calls
- **Environment Variables** - Secure key management

---

**Built with ❤️ for the research community**
