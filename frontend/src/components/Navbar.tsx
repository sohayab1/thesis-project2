import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath } from "@/utils/navigation";
import { Link } from "react-router-dom";

export function Navbar() {
  const { user, logout } = useAuth();
  const dashboardPath = getDashboardPath(user?.role);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={dashboardPath} className="text-xl font-semibold">
              Dashboard
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <Link
                to={`${dashboardPath}/profile`}
                className="text-gray-600 hover:text-gray-900"
              >
                Profile
              </Link>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}