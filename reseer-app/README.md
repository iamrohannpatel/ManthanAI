# ReSeer - AI-Powered Research Insight Platform

ReSeer is a comprehensive academic research insight platform that leverages AI to help students and researchers discover, analyze, and visualize research papers with intelligent insights.

## 🚀 Features

- **AI-Powered Analysis**: Upload PDFs or enter DOI/ArXiv IDs to get intelligent summaries and insights
- **Citation Mapping**: Interactive D3.js visualization of research networks and citation graphs
- **Cross-Disciplinary Insights**: Discover connections between different research domains
- **Research Gap Analysis**: Identify potential research opportunities and gaps
- **Personal Dashboard**: Save and organize your research insights
- **Modern UI**: Clean, responsive design with dark mode support

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Backend**: Firebase (Firestore + Authentication + Hosting)
- **APIs**: 
  - Google Gemini 1.5 Pro API
  - Semantic Scholar API
  - CrossRef API
- **Visualization**: D3.js
- **PDF Processing**: pdfjs-dist

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reseer-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Fill in your API keys in the `.env` file:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here

   # Google Gemini API
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Setup Instructions

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Google Sign-In)
4. Enable Firestore Database
5. Copy your Firebase config to the `.env` file

### Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnalysisResults.jsx
│   ├── GraphView.jsx
│   ├── InsightCard.jsx
│   ├── Navbar.jsx
│   ├── SavedPaperCard.jsx
│   └── UploadBox.jsx
├── context/            # React Context providers
│   └── AuthContext.jsx
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Dashboard.jsx
│   └── Home.jsx
├── utils/              # Utility functions
│   ├── firebaseConfig.js
│   ├── geminiAPI.js
│   ├── pdfReader.js
│   └── semanticScholarAPI.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🚀 Deployment

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**
   ```bash
   firebase init hosting
   ```

4. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 🎯 Usage

1. **Upload a PDF** or **enter a DOI/ArXiv ID**
2. **Click "Analyze Paper"** to get AI-powered insights
3. **View the results** including:
   - Summary and key topics
   - Research gaps and opportunities
   - Cross-disciplinary connections
   - Interactive citation network
4. **Save papers** to your dashboard (requires sign-in)
5. **Explore your research network** in the dashboard

## 🔑 API Keys Required

- **Firebase**: For authentication and database
- **Google Gemini**: For AI analysis and insights
- **Semantic Scholar**: For citation data (no key required)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🏆 Hackathon Project

Built for the Research App Hackathon in Indore. This project demonstrates the power of AI in academic research and provides a foundation for building more advanced research tools.

---

**Happy Researching! 🔬✨**
