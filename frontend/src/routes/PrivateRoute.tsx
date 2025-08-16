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

  // Allow access to profile page for all authenticated users
  if (location.pathname.includes('/profile')) {
    return <>{children}</>;
  }

  // For other routes, check role-based access
  if (roles && !roles.includes(user?.role as UserRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}