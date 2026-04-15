import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateAnnouncementPage } from './pages/CreateAnnouncementPage';
import { SchedulePage } from './pages/SchedulePage';
import { HistoryPage } from './pages/HistoryPage';
import { ResidentManagementPage } from './pages/ResidentManagementPage';
import { EmergencyBroadcastPage } from './pages/EmergencyBroadcastPage';
import { PublicAnnouncementsPage } from './pages/PublicAnnouncementsPage';
export function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <Toaster position="top-right" richColors />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/announcements"
              element={<PublicAnnouncementsPage />} />
            

            {/* Admin Routes (Wrapped in AdminLayout internally) */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create" element={<CreateAnnouncementPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/residents" element={<ResidentManagementPage />} />
            <Route path="/emergency" element={<EmergencyBroadcastPage />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </ThemeProvider>);

}