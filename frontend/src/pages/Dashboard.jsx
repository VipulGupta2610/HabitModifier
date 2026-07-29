import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Zap, LogOut, Flame, Target, TrendingUp, CheckCircle2, Plus } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-3"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium" style={{ color: '#4b5563' }}>{label}</span>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon size={13} color={color} />
      </div>
    </div>
    <span className="text-3xl font-extrabold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</span>
  </div>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="noise min-h-screen relative overflow-hidden" style={{ background: '#080810' }}>
      {/* Aurora */}
      <div className="aurora-bg">
        <div className="aurora-orb anim-aurora" style={{ width: 700, height: 700, background: 'radial-gradient(circle,rgba(109,40,217,0.2) 0%,transparent 70%)', top: -200, left: -200 }} />
        <div className="aurora-orb anim-aurora" style={{ width: 500, height: 500, background: 'radial-gradient(circle,rgba(6,182,212,0.12) 0%,transparent 70%)', bottom: -100, right: -100, animationDelay: '3s' }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 anim-float-up" style={{ animationFillMode: 'both' }}>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full opacity-40 blur-md" style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }} />
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                <Zap size={18} fill="white" color="white" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              Habit<span className="text-gradient">Modifier</span>
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: '#4b5563',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </header>

        {/* Welcome */}
        <div className="mb-10 anim-float-up delay-100" style={{ animationFillMode: 'both' }}>
          <p className="text-sm mb-2" style={{ color: '#6b7280' }}>Welcome back 👋</p>
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Hey, <span className="text-gradient">{user.name}</span>!
          </h1>
          <p className="text-sm mt-2" style={{ color: '#374151' }}>
            Your dashboard is launching soon. Keep building those habits! 🚀
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 anim-float-up delay-200" style={{ animationFillMode: 'both' }}>
          <StatCard label="Current Streak" value="0 days" icon={Flame} color="#f97316" />
          <StatCard label="Habits Active" value="0"       icon={Target} color="#8b5cf6" />
          <StatCard label="Total Check-ins" value="0"    icon={CheckCircle2} color="#22c55e" />
        </div>

        {/* CTA Card */}
        <div
          className="rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 anim-float-up delay-300"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(79,70,229,0.08) 50%, rgba(6,182,212,0.06) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
            animationFillMode: 'both',
          }}
        >
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Ready to build your first habit?
            </h2>
            <p className="text-sm" style={{ color: '#4b5563' }}>
              Start small, stay consistent, and watch the compound effect transform your life.
            </p>
          </div>
          <button
            className="btn-cta"
            style={{ width: 'auto', padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}
          >
            <Plus size={16} className="inline mr-2" />
            Add First Habit
          </button>
        </div>
      </div>
    </div>
  );
}
