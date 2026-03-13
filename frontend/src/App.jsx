import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import Scanner from './pages/Scanner';
import Exercises from './pages/Exercises';
import Coach from './pages/Coach';
import Community from './pages/Community';
import Progress from './pages/Progress';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import MealsLog from './pages/MealsLog';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DailyLogProvider } from './context/DailyLogContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user?.is_superuser !== true && user?.role !== 'admin') return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-serif">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

      {/* Experts/Coaches Platform */}
      {(user?.role === 'coach' || user?.role === 'nutritionist' || user?.role === 'expert') ? (
        <Route path="/" element={<ProtectedRoute><ExpertDashboard /></ProtectedRoute>} />
      ) : (
        /* Regular User Platform */
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="scan" element={<Scanner />} />
          <Route path="workouts" element={<Exercises />} />
          <Route path="coach" element={<Coach />} />
          <Route path="community" element={<Community />} />
          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} />
          <Route path="meals" element={<MealsLog />} />
          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Route>
      )}

      <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DailyLogProvider>
          <Router>
            <AppRoutes />
          </Router>
        </DailyLogProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
