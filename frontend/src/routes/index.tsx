import { Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from '@/types/enums';
import { PrivateRoute } from './PrivateRoute';
import { NewComplaintPage } from '@/pages/NewComplaintPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { DepartmentAdminDashboard } from '@/pages/DepartmentAdminDashboard';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User routes */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute roles={[UserRole.USER]}>
            <Routes>
              <Route index element={<DashboardPage />} />
              <Route path="new-complaint" element={<NewComplaintPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Routes>
          </PrivateRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute roles={[UserRole.ADMIN]}>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Routes>
          </PrivateRoute>
        }
      />

      {/* Department Admin routes */}
      <Route
        path="/department/*"
        element={
          <PrivateRoute roles={[UserRole.DEPARTMENT_ADMIN]}>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DepartmentAdminDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
            </Routes>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}