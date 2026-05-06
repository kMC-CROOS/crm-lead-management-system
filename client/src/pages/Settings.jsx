import { useState, useEffect } from 'react';
import { LogOut, UserCircle2, Settings2, Bell, Shield, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout, updateUser, getUsers } from '../lib/auth';
import { motion, AnimatePresence } from 'framer-motion';

function SettingsPage({ user, onLogout, onUpdateUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <section className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage account details, preferences, and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={UserCircle2} label="Profile" />
          <TabButton active={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')} icon={Settings2} label="Preferences" />
          <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell} label="Notifications" />
          <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield} label="Security" />
          <TabButton active={activeTab === 'data'} onClick={() => setActiveTab('data')} icon={AlertTriangle} label="Data Management" textClass="text-rose-600 hover:text-rose-700" />
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && <ProfileTab key="profile" user={user} onUpdateUser={onUpdateUser} showToast={showToast} />}
            {activeTab === 'preferences' && <PreferencesTab key="pref" showToast={showToast} />}
            {activeTab === 'notifications' && <NotificationsTab key="notif" showToast={showToast} />}
            {activeTab === 'security' && <SecurityTab key="sec" user={user} showToast={showToast} />}
            {activeTab === 'data' && <DataTab key="data" showToast={showToast} />}
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
        >
          <LogOut size={16} /> Logout All Sessions
        </button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
            <Check size={16} /> <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function TabButton({ active, onClick, icon: Icon, label, textClass = "text-slate-600" }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-indigo-50 text-indigo-700' : `hover:bg-slate-50 ${textClass}`}`}>
      <Icon size={18} className={active ? 'text-indigo-600' : ''} />
      {label}
    </button>
  );
}

function ProfileTab({ user, onUpdateUser, showToast }) {
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', role: user?.role || 'Admin' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (!formData.name) err.name = 'Name is required';
    if (!formData.email) err.email = 'Email is required';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      if (user?.id) {
         updateUser(user.id, formData);
      }
      
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('crm_user', JSON.stringify(updatedUser));
      if (onUpdateUser) onUpdateUser(updatedUser);
      showToast('Profile updated successfully');
    } catch (e) {
      showToast(e.message || 'Error updating profile', 'error');
    }
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500" />
        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500" />
        {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500">
          <option value="Admin">Admin</option>
          <option value="Sales Manager">Sales Manager</option>
          <option value="Salesperson">Salesperson</option>
        </select>
      </div>
      <div className="pt-2">
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">Save Changes</button>
      </div>
    </motion.form>
  );
}

function PreferencesTab({ showToast }) {
  const [prefs, setPrefs] = useState(() => {
    return JSON.parse(localStorage.getItem('crm_settings')) || { currency: 'USD', defaultStatus: 'New', theme: 'Light', dateFormat: 'MM/DD/YYYY' };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('crm_settings', JSON.stringify(prefs));
    showToast('Preferences saved');
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">CRM Preferences</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
          <select value={prefs.currency} onChange={e => setPrefs({...prefs, currency: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Lead Status</label>
          <select value={prefs.defaultStatus} onChange={e => setPrefs({...prefs, defaultStatus: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500">
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Won">Won</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
          <select value={prefs.theme} onChange={e => setPrefs({...prefs, theme: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500">
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="System">System default</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date Format</label>
          <select value={prefs.dateFormat} onChange={e => setPrefs({...prefs, dateFormat: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500">
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
      <div className="pt-2">
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">Save Preferences</button>
      </div>
    </motion.form>
  );
}

function NotificationsTab({ showToast }) {
  const [notif, setNotif] = useState(() => {
    return JSON.parse(localStorage.getItem('crm_notification_settings')) || { email: true, lead: true, notes: false, weekly: true };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('crm_notification_settings', JSON.stringify(notif));
    showToast('Notification settings saved');
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Notification Settings</h2>
      <div className="space-y-3">
        <ToggleRow label="Email Notifications" checked={notif.email} onChange={v => setNotif({...notif, email: v})} />
        <ToggleRow label="Lead Update Alerts" checked={notif.lead} onChange={v => setNotif({...notif, lead: v})} />
        <ToggleRow label="Note Addition Alerts" checked={notif.notes} onChange={v => setNotif({...notif, notes: v})} />
        <ToggleRow label="Weekly Report Emails" checked={notif.weekly} onChange={v => setNotif({...notif, weekly: v})} />
      </div>
      <div className="pt-4">
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">Save Notification Settings</button>
      </div>
    </motion.form>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
      </div>
      <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
    </label>
  );
}

function SecurityTab({ user, showToast }) {
  const [formData, setFormData] = useState({ current: '', new: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (!formData.current) err.current = 'Required';
    if (!formData.new || formData.new.length < 6) err.new = 'Min 6 characters required';
    if (formData.new !== formData.confirm) err.confirm = 'Passwords do not match';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    // Check current password
    let actualPass = 'password123';
    if (user?.id) {
       const u = getUsers().find(x => x.id === user.id);
       if (u) actualPass = u.password;
    }
    
    if (formData.current !== actualPass) {
       setErrors({ current: 'Incorrect current password' });
       return;
    }

    if (user?.id) {
       updateUser(user.id, { password: formData.new });
       showToast('Password updated successfully');
       setFormData({ current: '', new: '', confirm: '' });
    } else {
       showToast('Cannot update demo user password', 'error');
    }
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Security</h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
        <input type="password" value={formData.current} onChange={e => setFormData({...formData, current: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500" />
        {errors.current && <p className="text-xs text-rose-500 mt-1">{errors.current}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
        <input type="password" value={formData.new} onChange={e => setFormData({...formData, new: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500" />
        {errors.new && <p className="text-xs text-rose-500 mt-1">{errors.new}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
        <input type="password" value={formData.confirm} onChange={e => setFormData({...formData, confirm: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500" />
        {errors.confirm && <p className="text-xs text-rose-500 mt-1">{errors.confirm}</p>}
      </div>
      <div className="pt-2">
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">Update Password</button>
      </div>
    </motion.form>
  );
}

function DataTab({ showToast }) {
  const handleClear = () => {
    if(window.confirm('Are you sure? This will wipe all leads, notes, reports, and notifications.')) {
      localStorage.removeItem('crm_leads');
      localStorage.removeItem('crm_reports');
      localStorage.removeItem('crm_notifications');
      showToast('Data cleared successfully. Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleReset = () => {
    if(window.confirm('This will restore all default dummy data. Continue?')) {
      localStorage.removeItem('crm_leads');
      localStorage.removeItem('crm_reports');
      localStorage.removeItem('crm_notifications');
      showToast('Data reset to defaults. Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-lg font-semibold text-rose-600 mb-4">Danger Zone</h2>
      
      <div className="border border-rose-100 bg-rose-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-semibold text-rose-900">Clear All Demo Data</h3>
          <p className="text-sm text-rose-700">Wipe all leads, notes, reports, and notifications.</p>
        </div>
        <button onClick={handleClear} className="bg-white border border-rose-200 text-rose-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-rose-50 transition shrink-0">Clear Data</button>
      </div>

      <div className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">Reset CRM Data</h3>
          <p className="text-sm text-slate-500">Restore the default sample leads and reports.</p>
        </div>
        <button onClick={handleReset} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shrink-0">Factory Reset</button>
      </div>
    </motion.div>
  );
}

export default SettingsPage;
