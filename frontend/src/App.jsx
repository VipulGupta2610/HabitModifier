import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(14,14,24,0.95)',
              backdropFilter: 'blur(20px)',
              color: '#e2e8f0',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '14px',
              fontSize: '13.5px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
              padding: '14px 18px',
            },
            success: { iconTheme: { primary: '#8b5cf6', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/"          element={<Navigate to="/login" replace />} />
          <Route path="/login"     element={<AuthPage />} />
          <Route path="/signup"    element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*"          element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
