import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { 
  BookOpen, 
  LayoutDashboard, 
  LogOut, 
  PlusCircle, 
  FileText, 
  Search,
  Bell,
  Home,
  Info,
  Mail,
  Share2,
  Github
} from 'lucide-react';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserRequests from './pages/UserRequests';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SharePage from './pages/SharePage';
import { Button } from './components/ui/shared';
import { motion, AnimatePresence } from 'motion/react';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: 'student' | 'admin' }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-stone-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-stone-900" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  if (role && profile?.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
};

export default function App() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {user && (
        <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                  <div className="rounded-lg bg-stone-900 p-1.5 text-white">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-lg font-semibold tracking-tight">StudyNotes</span>
                </Link>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-stone-900' : 'text-stone-500'} hover:text-stone-900`}>Home</Link>
                <Link to="/browse" className={`text-sm font-medium ${location.pathname === '/browse' ? 'text-stone-900' : 'text-stone-500'} hover:text-stone-900`}>Browse</Link>
                {profile?.role === 'admin' ? (
                  <Link to="/admin" className={`text-sm font-medium ${location.pathname === '/admin' ? 'text-stone-900' : 'text-stone-500'} hover:text-stone-900`}>Admin</Link>
                ) : (
                  <Link to="/my-requests" className={`text-sm font-medium ${location.pathname === '/my-requests' ? 'text-stone-900' : 'text-stone-500'} hover:text-stone-900`}>Requests</Link>
                )}
                <Link to="/about" className={`text-sm font-medium ${location.pathname === '/about' ? 'text-stone-900' : 'text-stone-500'} hover:text-stone-900`}>About</Link>
                <Link to="/contact" className={`text-sm font-medium ${location.pathname === '/contact' ? 'text-stone-900' : 'text-stone-500'} hover:text-stone-900`}>Contact</Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-xs font-semibold text-stone-900">{profile?.name}</span>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">{profile?.role}</span>
                </div>
                <Button variant="ghost" className="h-9 w-9 p-0 rounded-full" onClick={handleSignOut}>
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={user ? "flex-grow mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8" : "flex-grow"}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />

            <Route path="/browse" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />

            <Route path="/about" element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            } />

            <Route path="/contact" element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            } />

            <Route path="/share" element={
              <ProtectedRoute>
                <SharePage />
              </ProtectedRoute>
            } />

            <Route path="/my-requests" element={
              <ProtectedRoute role="student">
                <UserRequests />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>

      {user && (
        <footer className="border-t border-stone-200 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-stone-900 p-1.5 text-white">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-lg font-semibold tracking-tight">StudyNotes Pro</span>
                </div>
                <p className="text-stone-500 text-sm max-w-xs">
                  The most comprehensive notes sharing platform for dedicated students.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900">Explore</h4>
                <div className="flex flex-col gap-2">
                  <Link to="/" className="text-sm text-stone-500 hover:text-stone-900">Home</Link>
                  <Link to="/browse" className="text-sm text-stone-500 hover:text-stone-900">Study Notes</Link>
                  <Link to="/share" className="text-sm text-stone-500 hover:text-stone-900">Share App</Link>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900">Support</h4>
                <div className="flex flex-col gap-2">
                  <Link to="/about" className="text-sm text-stone-500 hover:text-stone-900">About Us</Link>
                  <Link to="/contact" className="text-sm text-stone-500 hover:text-stone-900">Contact</Link>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 text-stone-400">
                <span className="text-xs">Version 1.2.0</span>
                <span className="h-4 w-px bg-stone-200"></span>
                <span className="text-xs font-medium bg-stone-100 px-2 py-0.5 rounded text-stone-600">Stable Release</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span>Made with ❤️ by</span>
                <a 
                  href="mailto:abhishekkumar3256@gmail.com" 
                  className="font-bold text-stone-900 hover:underline flex items-center gap-1"
                >
                  Abhishek Kumar
                </a>
              </div>

              <div className="flex gap-4">
                <a href="#" className="text-stone-400 hover:text-stone-900"><Github size={18} /></a>
                <a href="#" className="text-stone-400 hover:text-stone-900"><Mail size={18} /></a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
