# ReSeer Setup Instructions

## 🚀 Quick Start Guide

### 1. Install Dependencies

Since PowerShell execution policy is restricted, you have a few options:

**Option A: Use Command Prompt**
```cmd
cd "D:\New folder\reseer for research app hackathon indore\reseer-app"
npm install
```

**Option B: Enable PowerShell Scripts (Run as Administrator)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
npm install
```

**Option C: Use Git Bash or WSL**
```bash
cd "D:\New folder\reseer for research app hackathon indore\reseer-app"
npm install
```

### 2. Set Up Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   copy env.example .env
   ```

2. Fill in your API keys in the `.env` file:

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "reseer-app"
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google Sign-in
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
5. Get your config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click "Web app"
   - Copy the config values to your `.env` file

#### Google Gemini API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Deploy to Firebase (Optional)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Hosting" and "Firestore"
   - Use existing project
   - Set public directory to "dist"
   - Configure as single-page app: Yes
   - Set up automatic builds: No

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## 🎯 Features Ready to Use

✅ **Complete React + Vite setup**
✅ **TailwindCSS styling with dark mode**
✅ **Firebase Authentication (Google Sign-in)**
✅ **Firestore database integration**
✅ **PDF upload and text extraction**
✅ **DOI/ArXiv ID input support**
✅ **Google Gemini API integration**
✅ **Semantic Scholar API integration**
✅ **D3.js citation network visualization**
✅ **Responsive design**
✅ **Modern UI components**

## 🔧 Project Structure

```
reseer-app/
├── src/
│   ├── components/     # UI components
│   ├── pages/         # Page components
│   ├── utils/         # API utilities
│   ├── context/       # React context
│   └── hooks/         # Custom hooks
├── public/            # Static assets
├── .env               # Environment variables
├── firebase.json      # Firebase config
└── README.md          # Documentation
```

## 🚨 Troubleshooting

### PowerShell Execution Policy Error
- Use Command Prompt instead of PowerShell
- Or run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Firebase Connection Issues
- Check your Firebase config in `.env`
- Ensure Firestore rules are deployed
- Verify authentication is enabled

### API Errors
- Check your API keys in `.env`
- Ensure Gemini API is enabled
- Check network connectivity

## 🎉 You're Ready!

Once you've completed the setup, you'll have a fully functional AI-powered research platform that can:

1. **Upload PDFs** and extract text automatically
2. **Enter DOI/ArXiv IDs** to fetch paper metadata
3. **Get AI insights** using Google Gemini
4. **Visualize citation networks** with D3.js
5. **Save papers** to your personal dashboard
6. **Discover research gaps** and opportunities

Happy coding! 🚀
