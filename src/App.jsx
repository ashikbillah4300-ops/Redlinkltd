// ── App.jsx — Root Router & Layout ──────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { LangProvider } from './context/LangContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PageWrapper, WhatsAppFloat } from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import PayBillPage from './pages/PayBillPage';
import CoveragePage from './pages/CoveragePage';
import SupportPage from './pages/SupportPage';
import BusinessPage from './pages/BusinessPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/portal/LoginPage';
import DashboardPage from './pages/portal/DashboardPage';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/portal/login" replace />;
}

function AppContent() {
  return (
    <BrowserRouter>
      <PageWrapper>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/pay-bill" element={<PayBillPage />} />
            <Route path="/coverage" element={<CoveragePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/business" element={<BusinessPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Customer Portal */}
            <Route path="/portal/login" element={<LoginPage />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppFloat />

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(17,17,19,0.97)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '14px',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.40)',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#4ADE80', secondary: '#0A0A0B' },
              style: { borderColor: 'rgba(74,222,128,0.25)' },
            },
            error: {
              iconTheme: { primary: '#FF2D3F', secondary: '#0A0A0B' },
              style: { borderColor: 'rgba(225,29,46,0.30)' },
            },
          }}
        />
      </PageWrapper>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <AppContent />
      </LangProvider>
    </AuthProvider>
  );
}
