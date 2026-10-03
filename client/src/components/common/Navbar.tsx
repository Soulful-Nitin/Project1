import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { notificationsApi } from '../../services/api.js';
import { NotificationItem } from '../../types/index.js';
import {
  Utensils,
  Bell,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Menu,
  X,
  Sparkles,
  BarChart3,
  FileText,
  MessageSquareWarning,
  History,
  CalendarDays,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, quickLoginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.getMyNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Quiet fail for notifications
    }
  };

  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      if (link) {
        setNotificationsOpen(false);
        navigate(link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                  MESS<span className="text-emerald-600 font-extrabold">METER</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  Food Quality Analytics
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                {user?.role === 'student' ? (
                  <>
                    <Link
                      to="/student"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/student')
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Today's Menu
                    </Link>
                    <Link
                      to="/student/complaints"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/student/complaints')
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Complaints
                    </Link>
                    <Link
                      to="/student/history"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/student/history')
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      My Ratings
                    </Link>
                    <Link
                      to="/student/stats"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/student/stats')
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Mess Stats
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/admin"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/admin')
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Analytics Dashboard
                    </Link>
                    <Link
                      to="/admin/menu"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/admin/menu')
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Menu Manager
                    </Link>
                    <Link
                      to="/admin/complaints"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/admin/complaints')
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Complaints
                    </Link>
                    <Link
                      to="/admin/sentiment"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/admin/sentiment')
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      AI Sentiment
                    </Link>
                    <Link
                      to="/admin/reports"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/admin/reports')
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Reports & Export
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher Pills */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase px-2">Demo:</span>
              <button
                type="button"
                onClick={async () => {
                  await quickLoginAs('student');
                  navigate('/student');
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  user?.role === 'student'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={async () => {
                  await quickLoginAs('admin');
                  navigate('/admin');
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  user?.role === 'admin'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                🛡️ Admin
              </button>
            </div>

            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-slate-400 text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => handleMarkAsRead(n._id, n.link)}
                              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                                !n.read ? 'bg-emerald-50/40' : ''
                              }`}
                            >
                              <div className="mt-0.5">
                                {n.type === 'success' ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : n.type === 'alert' || n.type === 'warning' ? (
                                  <AlertCircle className="w-4 h-4 text-amber-500" />
                                ) : (
                                  <Clock className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-900 leading-tight">
                                  {n.title}
                                </p>
                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                  {n.message}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(n.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 self-start"></span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Badge & Logout */}
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[130px]">
                      {user?.name}
                    </p>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                      {user?.role === 'admin' ? 'Mess Admin' : `${user?.hostel || 'Student'}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 rounded-xl transition-all"
                >
                  Student Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{user?.name}</p>
                  <p className="text-xs text-slate-500">
                    {user?.role === 'admin' ? 'Administrator' : `${user?.hostel} (Room ${user?.room})`}
                  </p>
                </div>
              </div>

              {/* Mobile links */}
              <div className="grid grid-cols-1 gap-1 pt-1">
                {user?.role === 'student' ? (
                  <>
                    <Link
                      to="/student"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2.5"
                    >
                      <Utensils className="w-4 h-4 text-emerald-600" /> Today's Menu & Rate
                    </Link>
                    <Link
                      to="/student/complaints"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2.5"
                    >
                      <MessageSquareWarning className="w-4 h-4 text-emerald-600" /> Complaints Tracker
                    </Link>
                    <Link
                      to="/student/history"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2.5"
                    >
                      <History className="w-4 h-4 text-emerald-600" /> My Rating History
                    </Link>
                    <Link
                      to="/student/stats"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2.5"
                    >
                      <BarChart3 className="w-4 h-4 text-emerald-600" /> Mess Statistics
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2.5"
                    >
                      <BarChart3 className="w-4 h-4 text-emerald-600" /> Analytics Overview
                    </Link>
                    <Link
                      to="/admin/menu"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2.5"
                    >
                      <CalendarDays className="w-4 h-4 text-emerald-600" /> Menu & Dish Management
                    </Link>
                    <Link
                      to="/admin/complaints"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2.5"
                    >
                      <MessageSquareWarning className="w-4 h-4 text-emerald-600" /> Complaint Resolution
                    </Link>
                    <Link
                      to="/admin/sentiment"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" /> AI Sentiment & Feedback
                    </Link>
                    <Link
                      to="/admin/reports"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2.5"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" /> Reports & CSV Export
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await quickLoginAs('student');
                      setMobileMenuOpen(false);
                      navigate('/student');
                    }}
                    className="px-2.5 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-lg font-medium"
                  >
                    Demo Student
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await quickLoginAs('admin');
                      setMobileMenuOpen(false);
                      navigate('/admin');
                    }}
                    className="px-2.5 py-1 text-xs bg-slate-200 text-slate-800 rounded-lg font-medium"
                  >
                    Demo Admin
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold border border-slate-300 rounded-xl text-slate-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl"
              >
                Register as Student
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
