import {
  BarChart,
  Bell,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  UserRound,
  Users,
  X,
  Check,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../lib/auth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/leads/new', label: 'Add Lead', icon: Plus },
  { to: '/notes', label: 'Notes', icon: FileText },
  { to: '/users', label: 'Users', icon: UserRound },
  { to: '/reports', label: 'Reports', icon: BarChart },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function Layout({ user, children, onLogout }) {
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('crm_notifications');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: 'New lead added', message: 'John Doe', time: '2 min ago', read: false },
      { id: 2, title: 'Lead status updated', message: 'Sarah Smith status changed to Contacted', time: '15 min ago', read: false },
      { id: 3, title: 'Reminder', message: 'Follow up reminder for Michael Brown', time: '1 hr ago', read: false },
      { id: 4, title: 'New note', message: 'New note added to Acme Corp', time: '2 hrs ago', read: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('crm_notifications', JSON.stringify(notifications));
  }, [notifications]);
  const hasUnreadNotifications = notifications.some((item) => !item.read);

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      if (onLogout) onLogout();
      navigate('/login', { replace: true });
      setIsMobileSidebarOpen(false);
    }
  };

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  const toggleSidebar = () => {
    if (window.innerWidth >= 768) {
      setIsSidebarCollapsed((prev) => !prev);
      return;
    }

    setIsMobileSidebarOpen((prev) => !prev);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, read: true } : item));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-700">
      {isMobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-20 bg-slate-900/30 md:hidden"
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-30 h-full shrink-0 border-r border-slate-200/80 bg-white px-5 py-7 transition-all duration-300 md:static md:h-auto ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isSidebarCollapsed ? 'md:w-[80px]' : 'md:w-[260px]'
        } w-[260px] md:translate-x-0`}
      >
        <div className={`mb-8 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} gap-3`}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Users size={20} />
            </span>
            {!isSidebarCollapsed ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
                <h1 className="text-lg font-bold text-slate-900">Sales CRM</h1>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={closeMobileSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 md:hidden"
          >
            <X size={16} />
          </button>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isSidebarCollapsed ? 'justify-center' : 'gap-3'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`
              }
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={16} />
              {!isSidebarCollapsed ? item.label : null}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogoutClick}
            className={`mt-4 flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 ${
              isSidebarCollapsed ? 'justify-center' : 'gap-3'
            }`}
            title={isSidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut size={16} />
            {!isSidebarCollapsed ? 'Logout' : null}
          </button>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col transition-all duration-300">
        <header className="flex h-[72px] items-center border-b border-slate-200 bg-white px-6 md:px-8">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleSidebar}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Toggle sidebar"
              >
                <Menu size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <Bell size={18} />
                  {hasUnreadNotifications ? (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  ) : null}
                </button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 z-40 mt-2 w-[340px] rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-xl p-4 shadow-2xl"
                    >
                      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
                        <p className="text-base font-bold text-slate-900">Notifications</p>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            title="Mark all as read"
                            className="text-slate-400 hover:text-indigo-600 transition"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={clearAll}
                            title="Clear all"
                            className="text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {notifications.length > 0 ? (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => markAsRead(item.id)}
                              className={`cursor-pointer rounded-xl border p-3 transition-all hover:bg-slate-50 ${item.read ? 'border-transparent bg-transparent' : 'border-indigo-100 bg-indigo-50/50 shadow-sm'}`}
                            >
                              <div className="mb-1 flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {!item.read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0"></span>}
                                  <p className={`text-sm ${item.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>{item.title}</p>
                                </div>
                                <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">{item.time}</span>
                              </div>
                              <p className={`text-xs ${item.read ? 'text-slate-500' : 'text-slate-700 font-medium'} ml-${item.read ? '0' : '4'}`}>{item.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="py-6 text-center text-sm text-slate-500">
                            No notifications right now.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </span>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-500">{user?.email || 'admin@example.com'}</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
