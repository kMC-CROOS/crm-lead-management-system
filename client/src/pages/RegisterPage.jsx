import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, LayoutDashboard, User, ShieldCheck } from 'lucide-react';
import { register, googleSignIn } from '../lib/auth';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const blobMotion = (duration, delay = 0) => ({
  animate: { x: [0, 40, -30, 0], y: [0, -35, 20, 0], scale: [1, 1.15, 0.95, 1] },
  transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
});

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerWrap = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 32 } },
};

function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Salesperson' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) setFieldErrors((p) => ({ ...p, [e.target.name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Full name is required';
    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    else if (!emailPattern.test(formData.email.trim())) nextErrors.email = 'Enter a valid email address';
    if (!formData.password) nextErrors.password = 'Password is required';
    else if (formData.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) nextErrors.confirmPassword = 'Confirm password is required';
    else if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) nextErrors.role = 'Role is required';

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600)); // simulate network
      register({ name: formData.name.trim(), email: formData.email.trim(), password: formData.password, role: formData.role });
      setAuthSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setAuthError(err.message);
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
      className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-3xl" {...blobMotion(20, 0)} />
        <motion.div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-3xl" {...blobMotion(25, 2)} />
      </div>

      <motion.div
        className="w-full max-w-lg z-10"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg mb-4">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
          <p className="mt-2 text-sm text-slate-600">Join our CRM platform today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8" noValidate>
          <motion.div variants={staggerWrap} initial="hidden" animate="visible" className="space-y-4">
            
            <motion.div variants={staggerItem}>
              <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'name' ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 bg-white/50'}`}>
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="name" type="text" placeholder="Full Name" value={formData.name}
                  onChange={handleChange} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
            </motion.div>

            <motion.div variants={staggerItem}>
              <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'email' ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 bg-white/50'}`}>
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="email" type="email" placeholder="Email Address" value={formData.email}
                  onChange={handleChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
            </motion.div>

            <motion.div variants={staggerItem}>
              <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'password' ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 bg-white/50'}`}>
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="password" type={showPassword ? 'text' : 'password'} placeholder="Password (min. 6 characters)" value={formData.password}
                  onChange={handleChange} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-3 pl-11 pr-12 text-sm outline-none placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
            </motion.div>

            <motion.div variants={staggerItem}>
              <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'confirmPassword' ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 bg-white/50'}`}>
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={formData.confirmPassword}
                  onChange={handleChange} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-3 pl-11 pr-12 text-sm outline-none placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
            </motion.div>

            <motion.div variants={staggerItem}>
              <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'role' ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 bg-white/50'}`}>
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  name="role" value={formData.role}
                  onChange={handleChange} onFocus={() => setFocusedField('role')} onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-3 pl-11 pr-4 text-sm outline-none appearance-none cursor-pointer"
                >
                  <option value="Admin">Admin</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Salesperson">Salesperson</option>
                </select>
              </div>
              {fieldErrors.role && <p className="mt-1 text-xs text-red-500">{fieldErrors.role}</p>}
            </motion.div>

            <AnimatePresence>
              {authError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                  {authError}
                </motion.div>
              )}
              {authSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">
                  {authSuccess}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={staggerItem} className="pt-2">
              <button disabled={isLoading} type="submit" className="w-full py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] font-medium flex items-center justify-center">
                {isLoading ? <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Creating...</> : 'Create Account'}
              </button>
            </motion.div>

            <motion.div variants={staggerItem} className="pt-4 flex items-center justify-center space-x-4">
              <span className="h-px w-full bg-slate-200 block"></span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider whitespace-nowrap">Or</span>
              <span className="h-px w-full bg-slate-200 block"></span>
            </motion.div>

            <motion.div variants={staggerItem}>
              <button type="button" onClick={handleGoogleSignIn} className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] font-medium flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </motion.div>

            <motion.div variants={staggerItem} className="text-center mt-6">
              <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                Already have an account? Sign in
              </Link>
            </motion.div>

          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default RegisterPage;
