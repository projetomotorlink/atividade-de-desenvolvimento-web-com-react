import { Link } from 'react-router';
import { authService } from '~/services/auth.services';

import { Button } from './Button';

export function Navbar() {
  const handleLogout = () => {
    void authService.logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tighter text-zinc-900"
          >
            <span className="text-indigo-600">Motorlink</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-gray-900 transition-colors hover:text-indigo-600"
            >
              Home
            </Link>
            <Button
              onClick={handleLogout}
              variant="secondary"
              className="!px-3 !py-1.5 text-xs hover:bg-red-50 hover:text-red-600"
            >
              Deslogar
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
