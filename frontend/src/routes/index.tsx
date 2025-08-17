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

      {/* Shared routes that all authenticated users can access */}
      <Route path="/dashboard">
        {/* Profile route accessible to all authenticated users */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route path="/admin">
        <Route
          path="dashboard"
          element={
            <PrivateRoute roles={[UserRole.ADMIN]}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Department Admin routes */}
      <Route path="/department">
        <Route
          path="dashboard"
          element={
            <PrivateRoute roles={[UserRole.DEPARTMENT_ADMIN]}>
              <DepartmentAdminDashboard />
            </PrivateRoute>
          }
        />
      </Route>

      {/* User routes */}
      <Route path="/dashboard">
        <Route
          index
          element={
            <PrivateRoute roles={[UserRole.USER]}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="new-complaint"
          element={
            <PrivateRoute roles={[UserRole.USER]}>
              <NewComplaintPage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}