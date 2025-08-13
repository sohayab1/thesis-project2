import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface NavbarProps {
  // ...existing props...
}

export function Navbar({ /* ...existing props... */ }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="font-bold">
          Cybercrime Reporting
        </Link>

        {user && (
          <div className="flex items-center space-x-4 ml-4">
            <Button
              variant="ghost"
              onClick={handleDashboardClick}
            >
              Dashboard
            </Button>
            {/* ...other navigation items... */}
          </div>
        )}
      </div>
    </nav>
  );
}