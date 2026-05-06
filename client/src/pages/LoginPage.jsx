import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, LayoutDashboard, CheckCircle2, Users, DollarSign, Trophy } from 'lucide-react';
import { login, googleSignIn } from '../lib/auth';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const statCards = [
  { label: 'Total Leads', value: '1,248', icon: Users },
  { label: 'Deal Value', value: '$2.4M', icon: DollarSign },
  { label: 'Won Deals', value: '186', icon: Trophy },
];

const features = ['Lead Management', 'Smart Dashboard', 'Sales Reports', 'Team Management'];

const blobMotion = (duration, delay = 0) => ({
  animate: { x: [0, 40, -30, 0], y: [0, -35, 20, 0], scale: [1, 1.15, 0.95, 1] },
  transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
});

const leftPanelVariants = {
  hidden: { opacity: 0, x: -56 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.11, delayChildren: 0.08 } },
};

const leftChildVariants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 280, damping: 28 } },
};

const cardVariants = {
  hidden: { opacity: 0, x: 64 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.06 } },
};

const staggerWrap = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.075, delayChildren: 0.18 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 32 } },
};

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    const trimmedEmail = email.trim();
    const nextErrors = {};

    if (!trimmedEmail) nextErrors.email = 'Email is required';
    else if (!emailPattern.test(trimmedEmail)) nextErrors.email = 'Enter a valid email address';
    if (!password) nextErrors.password = 'Password is required';
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters';

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600)); // Simulating network
      const user = login(trimmedEmail, password);
      onLogin(user);
      navigate('/dashboard');
    } catch (loginError) {
      setAuthError(loginError.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const user = googleSignIn();
    onLogin(user);
    navigate('/dashboard');
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-800"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div className="absolute -left-[10%] top-[10%] h-[min(520px,90vw)] w-[min(520px,90vw)] rounded-full bg-gradient-to-br from-blue-200/50 via-indigo-200/50 to-transparent blur-3xl" {...blobMotion(22, 0)} />
        <motion.div className="absolute -right-[5%] top-[25%] h-[min(480px,85vw)] w-[min(480px,85vw)] rounded-full bg-gradient-to-bl from-purple-200/50 via-fuchsia-200/30 to-transparent blur-3xl" {...blobMotion(26, 1.5)} />
      </div>

      <div className="relative z-10 flex min-h-screen max-w-[100vw] flex-col lg:flex-row">
        {/* Desktop Branding Panel */}
        <motion.aside
          className="relative hidden w-full flex-col justify-center px-10 py-12 text-slate-800 lg:flex lg:w-[48%] xl:w-[45%] xl:px-14"
          variants={leftPanelVariants} initial="hidden" animate="visible"
        >
          <motion.div className="mb-8 flex items-center gap-4" variants={leftChildVariants}>
            <motion.div
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-indigo-200 ring-1 ring-white/50"
              animate={{ y: [0, -6, 0], boxShadow: ['0 10px 40px -10px rgba(99,102,241,0.3)', '0 20px 50px -12px rgba(99,102,241,0.5)', '0 10px 40px -10px rgba(99,102,241,0.3)'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <LayoutDashboard className="h-7 w-7 text-white" strokeWidth={2} />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Sales CRM</span>
          </motion.div>

          <motion.h2 className="max-w-lg text-3xl font-extrabold leading-[1.2] tracking-tight xl:text-[2.25rem] text-slate-900" variants={leftChildVariants}>
            Manage leads, track deals, and close more sales.
          </motion.h2>
          
          <motion.p className="mt-4 max-w-md text-lg text-slate-600 font-medium" variants={leftChildVariants}>
            A smart CRM dashboard for managing leads, notes, reports, and sales progress.
          </motion.p>

          <motion.ul className="mt-8 max-w-md space-y-4" variants={leftChildVariants}>
            {features.map((label, i) => (
              <motion.li
                key={label} className="flex items-center gap-3 text-sm font-semibold text-slate-700"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.12, type: 'spring', stiffness: 260, damping: 24 }}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" strokeWidth={2} />
                {label}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div className="mt-12 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-3" variants={leftChildVariants}>
            {statCards.map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                className="rounded-2xl border border-white/60 bg-white/40 px-4 py-4 shadow-xl shadow-slate-200/50 backdrop-blur-md"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 + i * 0.1, type: 'spring', stiffness: 300, damping: 26 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.7)' }}
              >
                <Icon className="mb-2 h-5 w-5 text-indigo-600" strokeWidth={2} />
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                <p className="mt-0.5 text-xl font-extrabold tabular-nums text-slate-900">{value}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.aside>

        {/* Mobile branding */}
        <motion.div className="flex flex-col items-center px-5 pt-7 text-center lg:hidden" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Sales CRM</span>
          </div>
        </motion.div>

        {/* Login column */}
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-4 pb-10 pt-4 sm:px-6 lg:px-10 lg:py-12">
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-2xl shadow-indigo-100/50 backdrop-blur-xl sm:p-10"
            variants={cardVariants} initial="hidden" animate="visible" noValidate
          >
            <motion.div variants={staggerWrap} initial="hidden" animate="visible">
              <motion.div variants={staggerItem} className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Welcome Back 👋</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">Sign in to access your CRM workspace</p>
                <p className="mt-1 text-xs text-slate-400">Use admin@example.com / password123</p>
              </motion.div>

              <motion.div variants={staggerItem} className="mt-8">
                <div className={`relative rounded-xl border transition-all duration-200 ${emailFocused ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white' : 'border-slate-200 bg-white/50'}`}>
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="login-email" name="email" type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors(p => ({ ...p, email: undefined })); }}
                    onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)}
                    className="w-full bg-transparent py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="admin@example.com"
                  />
                </div>
                {fieldErrors.email && <p className="mt-1.5 text-xs font-semibold text-red-500">{fieldErrors.email}</p>}
              </motion.div>

              <motion.div variants={staggerItem} className="mt-4">
                <div className={`relative rounded-xl border transition-all duration-200 ${passwordFocused ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white' : 'border-slate-200 bg-white/50'}`}>
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="login-password" name="password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(p => ({ ...p, password: undefined })); }}
                    onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)}
                    className="w-full bg-transparent py-3 pl-11 pr-12 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="password123"
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="mt-1.5 text-xs font-semibold text-red-500">{fieldErrors.password}</p>}
              </motion.div>

              <motion.div variants={staggerItem} className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                  Forgot password?
                </Link>
              </motion.div>

              <AnimatePresence>
                {authError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center shadow-sm">
                    {authError}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={staggerItem} className="mt-6">
                <button
                  type="submit" disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:shadow-xl hover:shadow-blue-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</> : 'Sign in'}
                </button>
              </motion.div>

              <motion.div variants={staggerItem} className="mt-6 flex items-center justify-center space-x-4">
                <span className="h-px w-full bg-slate-200 block"></span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Or</span>
                <span className="h-px w-full bg-slate-200 block"></span>
              </motion.div>

              <motion.div variants={staggerItem} className="mt-6">
                <button type="button" onClick={handleGoogleSignIn} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </motion.div>

              <motion.div variants={staggerItem} className="mt-6 text-center">
                <Link to="/register" className="text-sm font-bold text-blue-600 hover:text-indigo-600 transition">
                  Don't have an account? Create account
                </Link>
              </motion.div>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
}

export default LoginPage;
