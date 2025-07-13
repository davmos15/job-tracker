import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, appUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleMobileMenuToggle = () => {
    console.log('Mobile menu toggle clicked, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileNavClick = (item: typeof navigation[0]) => {
    console.log('Mobile nav clicked:', item.name, 'to:', item.href);
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Applications', href: ROUTES.APPLICATIONS },
    { name: 'Analytics', href: ROUTES.STATS },
    { name: 'Tracking', href: ROUTES.TRACKING },
  ];

  return (
    <header className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 w-full border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={ROUTES.APPLICATIONS}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Job Tracker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  {appUser?.photoURL ? (
                    <img
                      src={appUser.photoURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full ring-2 ring-border"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-foreground">
                    {appUser?.displayName || 
                     (appUser?.isAnonymous ? 'Guest User' : appUser?.email?.split('@')[0]) ||
                     'User'}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-lg border border-border z-[60] overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-muted/50">
                      <p className="text-sm font-medium text-foreground">
                        {appUser?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appUser?.isAnonymous ? 'Guest Account' : appUser?.email}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to={ROUTES.SETTINGS}
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3 text-muted-foreground" />
                        Settings
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-muted-foreground" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors touch-none"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border relative z-50">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-4 text-base font-medium rounded-lg transition-colors min-h-[48px] flex items-center ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                    onClick={() => handleMobileNavClick(item)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {(isMenuOpen || isProfileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;