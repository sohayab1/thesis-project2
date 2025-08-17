import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="font-bold">
          Cybercrime Reporting
        </Link>

        {user && (
          <div className="flex items-center space-x-4 ml-4">
            {/* Use absolute path for profile */}
            <Link
              to="/dashboard/profile"
              className="text-sm font-medium transition-colors hover:text-primary"
              style={{ textDecoration: 'none' }}
            >
              <Button variant="ghost">Profile</Button>
            </Link>
            <Button
              variant="ghost"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}