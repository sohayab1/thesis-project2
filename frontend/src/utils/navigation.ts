import { UserRole } from "@/types/enums";

export function getDashboardPath(role?: string): string {
  switch (role) {
    case UserRole.ADMIN:
      return '/admin/dashboard';
    case UserRole.DEPARTMENT_ADMIN:
      return '/department/dashboard';
    case UserRole.USER:
      return '/dashboard';
    default:
      return '/login';
  }
}