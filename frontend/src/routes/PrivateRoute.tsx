import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';

interface PrivateRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

export function PrivateRoute({ roles, children }: PrivateRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Profile page is accessible to all authenticated users
  if (location.pathname === '/dashboard/profile') {
    return <>{children}</>;
  }

  // For role-protected routes
  if (roles && !roles.includes(user?.role as UserRole)) {
    // Store the attempted URL
    const returnTo = location.pathname;

    // Redirect to their appropriate dashboard
    switch (user?.role) {
      case UserRole.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case UserRole.DEPARTMENT_ADMIN:
        return <Navigate to="/department/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}