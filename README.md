# Job Application Tracker

A modern, full-stack job application tracking web application built with React, TypeScript, Firebase, and Tailwind CSS.

## 🚀 Features

- **Application Management**: Create, edit, delete, and track job applications
- **Real-time Sync**: Firebase-powered real-time data synchronization  
- **Advanced Filtering**: Filter by status, company, date range, and search terms
- **Analytics Dashboard**: Visual insights into your job search progress
- **Multiple Auth Methods**: Google Sign-In, Email/Password, and Guest mode
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **React 18+** with TypeScript
- **Tailwind CSS** for styling
- **Firebase** (Authentication & Firestore)
- **React Hook Form** with Zod validation
- **Recharts** for data visualization
- **GitHub Pages** for hosting

## 📋 Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password, Google, Anonymous)
3. Create Firestore database
4. Get your Firebase config from Project Settings

### 3. Environment Configuration
Create `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firestore Rules
```bash
cd firebase
firebase deploy --only firestore:rules
```

### 5. GitHub Pages Deployment
1. Push code to GitHub
2. Add Firebase config as GitHub Secrets
3. Enable GitHub Pages in repository settings
4. GitHub Actions will automatically deploy

## 🔧 Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📄 License

MIT License - see LICENSE file for details.