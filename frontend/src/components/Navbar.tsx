import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const { user, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          Cybercrime Reporting
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate(getDashboardPath())}
                className={
                  location.pathname === getDashboardPath() ? "active" : ""
                }
              >
                Dashboard
              </Button>
              <Link to="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}