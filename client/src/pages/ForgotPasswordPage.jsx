import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, LayoutDashboard } from 'lucide-react';
import { forgotPassword } from '../lib/auth';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldError('');
    setMessage('');
    setErrorMsg('');

    if (!email.trim()) {
      setFieldError('Email is required');
      return;
    } else if (!emailPattern.test(email.trim())) {
      setFieldError('Enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600)); // simulate network delay
      forgotPassword(email.trim());
      setMessage('Password reset instructions sent successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'No account found with this email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md z-10">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg mb-4">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-600 text-center max-w-sm">Enter your email address and we'll send you instructions to reset your password.</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8" noValidate>
            
            <div className={`relative rounded-xl border transition-all duration-200 ${focusedField ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 bg-white/50'}`}>
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                name="email" type="email" placeholder="Email Address" value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
                onFocus={() => setFocusedField(true)} onBlur={() => setFocusedField(false)}
                className="w-full bg-transparent py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            {fieldError && <p className="mt-1 text-xs text-red-500">{fieldError}</p>}

            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                  {errorMsg}
                </motion.div>
              )}
              {message && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            <button disabled={isLoading} type="submit" className="mt-6 w-full py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] font-medium flex items-center justify-center">
              {isLoading ? <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Sending...</> : 'Send Reset Link'}
            </button>

            <div className="text-center mt-6">
              <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-700 inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ForgotPasswordPage;
