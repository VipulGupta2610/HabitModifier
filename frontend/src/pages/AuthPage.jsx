import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight,
  Zap, Check, Flame, Target, TrendingUp, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

/* ─── Helpers ─────────────────────────────────────────────────── */
const strengthData = (pw) => {
  if (!pw) return { score: 0, label: '', color: '#1f1f35' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const levels = [
    { label: '', color: '#1f1f35' },
    { label: 'Weak', color: '#ef4444' },
    { label: 'Fair', color: '#f97316' },
    { label: 'Good', color: '#eab308' },
    { label: 'Strong', color: '#22c55e' },
  ];
  return { score: s, ...levels[s] };
};

/* ─── Animated logo mark ──────────────────────────────────────── */
const LogoMark = ({ size = 36 }) => (
  <div className="relative" style={{ width: size, height: size }}>
    {/* Outer spinning ring */}
    <svg
      className="anim-spin-ring absolute inset-0"
      width={size} height={size} viewBox="0 0 36 36"
      style={{ opacity: 0.5 }}
    >
      <circle cx="18" cy="18" r="16" fill="none" stroke="url(#rg1)" strokeWidth="1.5" strokeDasharray="6 4" />
      <defs>
        <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
    {/* Inner reverse ring */}
    <svg
      className="anim-spin-reverse absolute inset-0"
      width={size} height={size} viewBox="0 0 36 36"
      style={{ opacity: 0.3 }}
    >
      <circle cx="18" cy="18" r="11" fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="3 6" />
    </svg>
    {/* Core icon */}
    <div
      className="absolute inset-0 flex items-center justify-center rounded-full"
      style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
    >
      <Zap size={size * 0.45} fill="white" color="white" />
    </div>
  </div>
);

/* ─── Feature pill ────────────────────────────────────────────── */
const FeaturePill = ({ icon: Icon, label, color, delay }) => (
  <div
    className="bento-item anim-float-up flex items-center gap-3"
    style={{ animationDelay: delay, animationFillMode: 'both' }}
  >
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}18` }}
    >
      <Icon size={16} color={color} />
    </div>
    <span className="text-sm text-gray-400 font-medium">{label}</span>
  </div>
);

/* ─── Stat block ──────────────────────────────────────────────── */
const Stat = ({ value, label, color, delay }) => (
  <div className="stat-card anim-float-up" style={{ animationDelay: delay, animationFillMode: 'both' }}>
    <span className="text-xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color }}>{value}</span>
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

/* ─── Custom checkbox ─────────────────────────────────────────── */
const Checkbox = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="w-4 h-4 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-300"
    style={{
      background: checked ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'transparent',
      border: checked ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
      boxShadow: checked ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
    }}
  >
    {checked && (
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
        <path
          d="M1 3.5L3.2 5.8L8 1"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="20"
          strokeDashoffset="0"
          style={{ animation: 'check-draw 0.3s ease forwards' }}
        />
      </svg>
    )}
  </button>
);

/* ─── Input wrapper ───────────────────────────────────────────── */
const InputField = ({ icon: Icon, rightEl, error, success, ...props }) => (
  <div className="relative">
    <Icon
      size={15}
      className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: '#3d3d5c' }}
    />
    <input
      {...props}
      className={`input-modern ${error ? 'error' : ''} ${success ? 'success' : ''}`}
      style={{ paddingRight: rightEl ? '3rem' : undefined }}
    />
    {rightEl && (
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>
    )}
  </div>
);

/* ─── Main Page ───────────────────────────────────────────────── */
export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [lEmail, setLEmail]   = useState('');
  const [lPw, setLPw]         = useState('');

  const [sName, setSName]     = useState('');
  const [sEmail, setSEmail]   = useState('');
  const [sPw, setSPw]         = useState('');
  const [sConfirm, setSConfirm] = useState('');

  const navigate = useNavigate();
  const { login, signup, user } = useAuth();

  const strength = strengthData(sPw);
  const pwMatch = sConfirm && sConfirm === sPw;
  const pwMismatch = sConfirm && sConfirm !== sPw;

  useEffect(() => { if (user) navigate('/dashboard', { replace: true }); }, [user, navigate]);

  /* ── Login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!lEmail || !lPw) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(lEmail, lPw);
      toast.success('Welcome back! 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  /* ── Signup ── */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!sName || !sEmail || !sPw || !sConfirm) return toast.error('Fill in all fields');
    if (sPw !== sConfirm) return toast.error("Passwords don't match");
    if (sPw.length < 6) return toast.error('Password must be 6+ characters');
    if (!agreed) return toast.error('Please accept the Terms');
    setLoading(true);
    try {
      await signup(sName, sEmail, sPw);
      toast.success('Account created! Let\'s go 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const EyeBtn = ({ show, toggle }) => (
    <button
      type="button" onClick={toggle}
      className="transition-colors"
      style={{ color: '#3d3d5c' }}
      onMouseEnter={e => e.currentTarget.style.color = '#8b5cf6'}
      onMouseLeave={e => e.currentTarget.style.color = '#3d3d5c'}
    >
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <div className="noise min-h-screen w-full flex relative overflow-hidden" style={{ background: '#080810' }}>

      {/* ── Aurora BG ─────────────────────────────────────────── */}
      <div className="aurora-bg">
        <div
          className="aurora-orb anim-aurora"
          style={{
            width: 800, height: 800,
            background: 'radial-gradient(circle, rgba(109,40,217,0.28) 0%, transparent 70%)',
            top: -250, left: -250,
          }}
        />
        <div
          className="aurora-orb anim-aurora"
          style={{
            width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)',
            top: '30%', left: '25%',
            animationDelay: '2s',
          }}
        />
        <div
          className="aurora-orb anim-aurora"
          style={{
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
            bottom: -150, right: -100,
            animationDelay: '4s',
          }}
        />
        <div
          className="aurora-orb"
          style={{
            width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
            top: '60%', left: '60%',
            animationDelay: '1s',
          }}
        />
        {/* Photo layer */}
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL
      ══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col justify-between flex-1 relative z-10 p-14 xl:p-20">
        {/* Logo */}
        <div className="flex items-center gap-3 anim-slide-left" style={{ animationFillMode: 'both' }}>
          <LogoMark size={36} />
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Habit<span className="text-gradient">Modifier</span>
          </span>
        </div>

        {/* Main copy */}
        <div className="space-y-10 max-w-lg">
          <div className="space-y-5">
            <div className="badge-glow anim-float-up delay-100">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
              Trusted by 50,000+ achievers
            </div>

            <h1
              className="text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight anim-float-up delay-200"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Small habits,<br />
              <span className="text-gradient">massive results</span>
            </h1>

            <p className="text-base text-gray-500 leading-relaxed anim-float-up delay-300">
              HabitModifier uses behavioral science and AI to help you
              build routines that actually stick — one day at a time.
            </p>
          </div>

          {/* Feature bento */}
          <div className="grid grid-cols-2 gap-3 anim-float-up delay-400">
            <FeaturePill icon={Flame}    label="Streak Tracking"      color="#f97316" delay="400ms" />
            <FeaturePill icon={Target}   label="Smart Goal Setting"   color="#8b5cf6" delay="450ms" />
            <FeaturePill icon={TrendingUp} label="Progress Analytics" color="#06b6d4" delay="500ms" />
            <FeaturePill icon={Shield}   label="Privacy First"        color="#22c55e" delay="550ms" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 anim-float-up delay-500">
            <Stat value="50K+"  label="Active users"   color="#a78bfa" delay="600ms" />
            <Stat value="94%"   label="Success rate"   color="#34d399" delay="650ms" />
            <Stat value="2.1M+" label="Habits tracked" color="#60a5fa" delay="700ms" />
          </div>
        </div>

        {/* Testimonial */}
        <div className="glass rounded-2xl p-5 max-w-sm anim-float-up delay-700" style={{ animationFillMode: 'both' }}>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            &ldquo;HabitModifier completely transformed my morning routine.
            The streaks keep me accountable like nothing else.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }} />
            <div>
              <div className="text-xs font-semibold text-gray-300">Arjun Mehta</div>
              <div className="text-xs text-gray-600">Product Manager · 142-day streak 🔥</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — Auth Card
      ══════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex items-center justify-center p-5 lg:p-10 relative z-10">
        <div className="w-full max-w-[420px] anim-slide-right" style={{ animationFillMode: 'both' }}>

          {/* Card */}
          <div className="glass-bright rounded-2xl p-8">

            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2.5 mb-7">
              <LogoMark size={30} />
              <span className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
                Habit<span className="text-gradient">Modifier</span>
              </span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2
                className="text-2xl font-bold text-white mb-1"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                {tab === 'login' ? 'Good to see you again' : 'Join the movement'}
              </h2>
              <p className="text-sm" style={{ color: '#4b5563' }}>
                {tab === 'login'
                  ? 'Sign in to continue building great habits'
                  : 'Create your account — it only takes 30 seconds'}
              </p>
            </div>

            {/* Tabs */}
            <div className="tab-bar mb-6">
              {['login', 'signup'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`tab-item ${tab === t ? 'active' : 'inactive'}`}
                >
                  {t === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* ── Google button ── */}
            <button className="btn-social mb-5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2a10.34 10.34 0 0 0-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908C16.658 14.383 17.64 12.076 17.64 9.2z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A9.009 9.009 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961l3.007 2.332C4.672 5.165 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="divider mb-5">or</div>

            {/* ─────────────── LOGIN FORM ─────────────── */}
            {tab === 'login' && (
              <form className="space-y-4 anim-fade-in" onSubmit={handleLogin}>
                <InputField
                  icon={Mail}
                  type="email"
                  placeholder="Email address"
                  value={lEmail}
                  onChange={e => setLEmail(e.target.value)}
                  autoComplete="email"
                />
                <InputField
                  icon={Lock}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Password"
                  value={lPw}
                  onChange={e => setLPw(e.target.value)}
                  autoComplete="current-password"
                  rightEl={<EyeBtn show={showPw} toggle={() => setShowPw(v => !v)} />}
                />

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs transition-colors" style={{ color: '#6b21a8' }}
                    onMouseEnter={e => e.target.style.color='#a78bfa'}
                    onMouseLeave={e => e.target.style.color='#6b21a8'}
                  >
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" disabled={loading} className="btn-cta">
                  <span className="btn-shine" />
                  <span className={`flex items-center justify-center gap-2 relative z-10 ${loading ? 'opacity-0' : ''}`}>
                    Sign In <ArrowRight size={16} />
                  </span>
                  {loading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="spinner" />
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* ─────────────── SIGNUP FORM ─────────────── */}
            {tab === 'signup' && (
              <form className="space-y-4 anim-fade-in" onSubmit={handleSignup}>
                <InputField
                  icon={User}
                  type="text"
                  placeholder="Full name"
                  value={sName}
                  onChange={e => setSName(e.target.value)}
                  autoComplete="name"
                />
                <InputField
                  icon={Mail}
                  type="email"
                  placeholder="Email address"
                  value={sEmail}
                  onChange={e => setSEmail(e.target.value)}
                  autoComplete="email"
                />

                {/* Password + strength */}
                <div className="space-y-2">
                  <InputField
                    icon={Lock}
                    type={showPw ? 'text' : 'password'}
                    placeholder="Create password"
                    value={sPw}
                    onChange={e => setSPw(e.target.value)}
                    autoComplete="new-password"
                    rightEl={<EyeBtn show={showPw} toggle={() => setShowPw(v => !v)} />}
                  />
                  {sPw && (
                    <div className="space-y-1 anim-fade-in px-1">
                      <div className="strength-track">
                        {[1,2,3,4].map(i => (
                          <div
                            key={i}
                            className="strength-seg"
                            style={{ background: strength.score >= i ? strength.color : 'rgba(255,255,255,0.07)' }}
                          />
                        ))}
                      </div>
                      <span className="text-xs" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <InputField
                  icon={Lock}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={sConfirm}
                  onChange={e => setSConfirm(e.target.value)}
                  autoComplete="new-password"
                  error={pwMismatch}
                  success={pwMatch}
                  rightEl={
                    <div className="flex items-center gap-2">
                      {pwMatch && <Check size={14} color="#22c55e" />}
                      <EyeBtn show={showConfirm} toggle={() => setShowConfirm(v => !v)} />
                    </div>
                  }
                />

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer mt-1">
                  <Checkbox checked={agreed} onChange={setAgreed} />
                  <span className="text-xs leading-relaxed" style={{ color: '#4b5563' }}>
                    I agree to the{' '}
                    <Link to="/terms" className="hover:text-violet-400 transition-colors" style={{ color: '#7c3aed' }}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="hover:text-violet-400 transition-colors" style={{ color: '#7c3aed' }}>
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <button type="submit" disabled={loading} className="btn-cta">
                  <span className="btn-shine" />
                  <span className={`flex items-center justify-center gap-2 relative z-10 ${loading ? 'opacity-0' : ''}`}>
                    Create Account <ArrowRight size={16} />
                  </span>
                  {loading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="spinner" />
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* Switch tab link */}
            <p className="text-center text-xs mt-5" style={{ color: '#374151' }}>
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
                className="font-semibold transition-colors"
                style={{ color: '#7c3aed' }}
                onMouseEnter={e => e.target.style.color = '#a78bfa'}
                onMouseLeave={e => e.target.style.color = '#7c3aed'}
              >
                {tab === 'login' ? 'Sign up free →' : 'Sign in →'}
              </button>
            </p>
          </div>

          {/* Trust bar */}
          <div className="flex items-center justify-center gap-5 mt-5 anim-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
            {[['🔒', 'SSL Encrypted'], ['⚡', 'Instant Access'], ['🌍', 'GDPR Ready']].map(([ic, lb]) => (
              <div key={lb} className="flex items-center gap-1.5 text-xs" style={{ color: '#1f2937' }}>
                <span>{ic}</span><span>{lb}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
