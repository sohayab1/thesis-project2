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
          
          {/* Left Side Logo / Title */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold">
              Dashboard
            </Link>
          </div>

          {/* Right Side Menu */}
          <div className="flex items-center space-x-6">
            <Link to="/news" className="text-gray-600 hover:text-gray-900">
              News
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact Us
            </Link>

            <Link to="/faq" className="text-gray-600 hover:text-gray-900">
              Fraud Type
            </Link>

            {user && (
              <>
                <Link
                  to={`${dashboardPath}/profile`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Profile
                </Link>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
