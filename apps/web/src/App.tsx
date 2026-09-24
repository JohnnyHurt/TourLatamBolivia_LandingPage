import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { SpeakerDetailPage } from './pages/public/SpeakerDetailPage';

// Admin Pages
import { LoginPage } from './pages/admin/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardPage } from './pages/admin/DashboardPage';
import { EventSettingsPage } from './pages/admin/EventSettingsPage';
import { PageBuilderPage } from './pages/admin/PageBuilderPage';
import { SpeakersListPage } from './pages/admin/SpeakersListPage';
import { SpeakerFormPage } from './pages/admin/SpeakerFormPage';
import { SponsorsListPage } from './pages/admin/SponsorsListPage';
import { SponsorFormPage } from './pages/admin/SponsorFormPage';
import { TicketsPage } from './pages/admin/TicketsPage';
import { AgendaPage } from './pages/admin/AgendaPage';
import { MediaLibraryPage } from './pages/admin/MediaLibraryPage';
import { UsersPage } from './pages/admin/UsersPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-cyan"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/speakers/:slug" element={<SpeakerDetailPage />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Backoffice CMS Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="event" element={<EventSettingsPage />} />
            <Route path="pages" element={<PageBuilderPage />} />

            {/* Speakers */}
            <Route path="speakers" element={<SpeakersListPage />} />
            <Route path="speakers/new" element={<SpeakerFormPage />} />
            <Route path="speakers/:id" element={<SpeakerFormPage />} />

            {/* Sponsors */}
            <Route path="sponsors" element={<SponsorsListPage />} />
            <Route path="sponsors/new" element={<SponsorFormPage />} />
            <Route path="sponsors/:id" element={<SponsorFormPage />} />

            {/* Tickets & Agenda */}
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="agenda" element={<AgendaPage />} />

            {/* Media */}
            <Route path="media" element={<MediaLibraryPage />} />

            {/* Admin Only Routes */}
            <Route
              path="users"
              element={
                <ProtectedRoute requireAdmin>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="audit-logs"
              element={
                <ProtectedRoute requireAdmin>
                  <AuditLogsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
