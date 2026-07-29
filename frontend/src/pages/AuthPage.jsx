import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// ─── Password strength helper ────────────────────────────────────────────────
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: 'Too short', color: '#ef4444' },
    { label: 'Weak', color: '#f97316' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Good', color: '#22c55e' },
    { label: 'Strong', color: '#10b981' },
  ];
  return { score, ...map[score] };
};

// ─── Floating animated particle ──────────────────────────────────────────────
const Particle = ({ style }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      background: 'radial-gradient(circle, rgba(167,139,250,0.6) 0%, transparent 70%)',
      ...style,
    }}
  />
);

// ─── Feature bullet ──────────────────────────────────────────────────────────
const Feature = ({ text, delay }) => (
  <div
    className="flex items-center gap-3 animate-slide-up"
    style={{ animationDelay: delay, animationFillMode: 'both' }}
  >
    <CheckCircle2 size={16} className="text-violet-400 shrink-0" />
    <span className="text-sm text-slate-400">{text}</span>
  </div>
);

// ─── Main Auth Page ───────────────────────────────────────────────────────────
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);

  const navigate = useNavigate();
  const { login, signup, user } = useAuth();

  const strength = getPasswordStrength(signupPassword);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  // ── Login submit ────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      return toast.error('Please fill in all fields');
    }
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success('Welcome back! 🎉', { icon: '🚀' });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Signup submit ───────────────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      return toast.error('Please fill in all fields');
    }
    if (signupPassword !== signupConfirm) {
      return toast.error('Passwords do not match');
    }
    if (signupPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (!agreed) {
      return toast.error('Please agree to the Terms of Service');
    }
    setLoading(true);
    try {
      await signup(signupName, signupEmail, signupPassword);
      toast.success('Account created! Let\'s build habits 💪', { icon: '✨' });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden dots-grid" style={{ background: '#0a0a0f' }}>

      {/* ── Background Image ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/auth-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ── Animated orbs ─────────────────────────────────────────────── */}
      <div className="orb animate-pulse-glow" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)', top: -150, left: -150 }} />
      <div className="orb animate-pulse-glow" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)', bottom: -100, right: -100, animationDelay: '1.5s' }} />
      <div className="orb animate-float" style={{ width: 200, height: 200, background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', top: '40%', left: '35%', animationDelay: '3s' }} />

      {/* ── Floating particles ─────────────────────────────────────────── */}
      <Particle style={{ width: 6, height: 6, top: '15%', left: '20%', animation: 'float 4s ease-in-out infinite' }} />
      <Particle style={{ width: 4, height: 4, top: '70%', left: '15%', animation: 'float 5s ease-in-out infinite 1s' }} />
      <Particle style={{ width: 8, height: 8, top: '30%', right: '25%', animation: 'float 6s ease-in-out infinite 2s' }} />
      <Particle style={{ width: 5, height: 5, bottom: '20%', right: '40%', animation: 'float 4.5s ease-in-out infinite 0.5s' }} />

      {/* ══════════════════════════════════════════════════════════════════
          LEFT PANEL  – Branding & Features
      ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col justify-between flex-1 relative z-10 p-12 xl:p-16">

        {/* Logo */}
        <div className="flex items-center gap-3 animate-slide-up" style={{ animationFillMode: 'both' }}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-bounce-subtle"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              <Zap size={20} fill="white" className="text-white" />
            </div>
            <div className="absolute -inset-1 rounded-xl opacity-40 blur-md"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Habit<span className="gradient-text">Modifier</span>
          </span>
        </div>

        {/* Hero Copy */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium animate-fade-in"
              style={{ borderColor: 'rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)', color: '#a78bfa' }}>
              <Sparkles size={12} />
              Transform your daily routines
            </div>
            <h1 className="text-5xl xl:text-6xl font-black leading-tight animate-slide-up"
              style={{ fontFamily: 'Outfit, sans-serif', animationDelay: '0.1s', animationFillMode: 'both' }}>
              Build habits that<br />
              <span className="gradient-text">actually stick</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md animate-slide-up leading-relaxed"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              Track, analyze, and master your daily rituals with AI-powered insights. 
              Join thousands building their best selves.
            </p>
          </div>

          <div className="space-y-3">
            {[
              ['Smart habit tracking with streaks & rewards', '0.3s'],
              ['AI-powered insights and pattern analysis', '0.4s'],
              ['Beautiful progress visualization', '0.5s'],
              ['Community challenges & accountability', '0.6s'],
            ].map(([text, delay]) => (
              <Feature key={text} text={text} delay={delay} />
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-8 animate-slide-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
            {[['50K+', 'Active Users'], ['2M+', 'Habits Tracked'], ['94%', 'Success Rate']].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>{num}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-600">
          © 2025 HabitModifier. Built for dreamers.
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RIGHT PANEL – Auth Card
      ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-auto lg:min-w-[480px] xl:min-w-[520px] flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-slide-up" style={{ animationFillMode: 'both' }}>

          {/* Glass card */}
          <div className="glass-card rounded-2xl p-8">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                <Zap size={16} fill="white" className="text-white" />
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Habit<span className="gradient-text">Modifier</span>
              </span>
            </div>

            {/* Tab switcher */}
            <div className="flex p-1 rounded-lg mb-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.15)' }}>
              {['login', 'signup'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-btn ${activeTab === tab ? 'active' : 'inactive'}`}
                >
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* ── LOGIN FORM ─────────────────────────────────────────── */}
            {activeTab === 'login' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Welcome back
                  </h2>
                  <p className="text-sm text-slate-500">Sign in to continue your journey</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email */}
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="input-field"
                      autoComplete="email"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="input-field"
                      style={{ paddingRight: '3rem' }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Forgot password */}
                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading} className="btn-primary relative">
                    <span className={`flex items-center justify-center gap-2 relative z-10 ${loading ? 'opacity-0' : ''}`}>
                      Sign In <ArrowRight size={16} />
                    </span>
                    {loading && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="divider my-6">or continue with</div>

                {/* Google */}
                <button className="btn-social">
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.707C3.784 10.167 3.682 9.59 3.682 9s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9c0 1.45.348 2.826.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="text-center text-sm text-slate-500 mt-6">
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setActiveTab('signup')} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                    Sign up free
                  </button>
                </p>
              </div>
            )}

            {/* ── SIGNUP FORM ────────────────────────────────────────── */}
            {activeTab === 'signup' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Start your journey
                  </h2>
                  <p className="text-sm text-slate-500">Create your free account in seconds</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Full name */}
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="input-field"
                      autoComplete="name"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="input-field"
                      autoComplete="email"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="input-field"
                        style={{ paddingRight: '3rem' }}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-400 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength bars */}
                    {signupPassword && (
                      <div className="space-y-1.5 animate-fade-in">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="strength-bar flex-1"
                              style={{
                                background: strength.score >= i ? strength.color : 'rgba(255,255,255,0.08)',
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs" style={{ color: strength.color }}>
                          {strength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      className="input-field"
                      style={{
                        paddingRight: '3rem',
                        borderColor: signupConfirm && signupConfirm !== signupPassword
                          ? '#ef4444'
                          : signupConfirm && signupConfirm === signupPassword
                            ? '#22c55e'
                            : undefined,
                      }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-400 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className="w-4 h-4 rounded transition-all duration-200 flex items-center justify-center"
                        style={{
                          background: agreed ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(255,255,255,0.05)',
                          border: agreed ? 'none' : '1px solid rgba(124,58,237,0.4)',
                          boxShadow: agreed ? '0 0 10px rgba(124,58,237,0.4)' : 'none',
                        }}
                      >
                        {agreed && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" className="text-violet-400 hover:text-violet-300 transition-colors">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">Privacy Policy</Link>
                    </span>
                  </label>

                  {/* Submit */}
                  <button type="submit" disabled={loading} className="btn-primary relative">
                    <span className={`flex items-center justify-center gap-2 relative z-10 ${loading ? 'opacity-0' : ''}`}>
                      Create Account <ArrowRight size={16} />
                    </span>
                    {loading && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="divider my-6">or sign up with</div>

                {/* Google */}
                <button className="btn-social">
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.707C3.784 10.167 3.682 9.59 3.682 9s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9c0 1.45.348 2.826.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="text-center text-sm text-slate-500 mt-6">
                  Already have an account?{' '}
                  <button onClick={() => setActiveTab('login')} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-6 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            {[
              ['🔒', 'SSL Secured'],
              ['🛡️', 'GDPR Ready'],
              ['⚡', 'Instant Access'],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
