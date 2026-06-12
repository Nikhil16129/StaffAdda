import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobSearchPage from './pages/JobSearchPage';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import CompaniesPage from './pages/CompaniesPage';
import ApplyJobPage from './pages/ApplyJobPage';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to={user.role === 'employer' ? '/employer/dashboard' : '/dashboard'} replace />;
  }
  return children;
}

// Layout with Navbar + Footer
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public pages with full layout */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/apply/:jobId"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <ApplyJobPage />
              </ProtectedRoute>
            }
          />

          {/* Auth pages — no navbar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected: Job Seeker Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected: Employer Dashboard */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute requiredRole="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected: Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
