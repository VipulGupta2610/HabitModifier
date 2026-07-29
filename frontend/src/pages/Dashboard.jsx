import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Zap, LayoutDashboard, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden dots-grid" style={{ background: '#0a0a0f' }}>
      {/* Orbs */}
      <div className="orb animate-pulse-glow" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', top: -100, left: -100 }} />
      <div className="orb animate-pulse-glow" style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', bottom: -80, right: -80, animationDelay: '2s' }} />

      <div className="relative z-10 text-center space-y-6 px-6 animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-bounce-subtle"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              <Zap size={24} fill="white" className="text-white" />
            </div>
            <div className="absolute -inset-1 rounded-xl opacity-40 blur-md"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }} />
          </div>
          <span className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Habit<span className="gradient-text">Modifier</span>
          </span>
        </div>

        {/* Welcome message */}
        <div className="glass-card rounded-2xl p-10 max-w-md mx-auto space-y-4">
          <LayoutDashboard size={48} className="mx-auto text-violet-400 mb-2 animate-bounce-subtle" />
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Welcome back,<br />
            <span className="gradient-text">{user.name}! 🎉</span>
          </h1>
          <p className="text-slate-400 text-sm">
            You're logged in as <span className="text-violet-400">{user.email}</span>
          </p>
          <p className="text-slate-500 text-xs pt-2">
            Your dashboard is coming soon. Start building your habits! 💪
          </p>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
