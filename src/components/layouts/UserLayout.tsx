import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Home, 
  ShoppingBag, 
  Store, 
  CreditCard, 
  User, 
  Bell, 
  LogOut, 
  Menu,
  X,
  Wallet
} from 'lucide-react';
import { PaymentConnect } from '../auth/PaymentConnect';
import { NotificationDropdown } from '../shared/NotificationDropdown';
import { ThemeToggle } from '../theme/ThemeToggle';

interface UserLayoutProps {
  user: any;
  onLogout: () => void;
}

export function UserLayout({ user, onLogout }: UserLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, path: '/orders' },
    { id: 'marketplace', label: 'Marketplace', icon: Store, path: '/marketplace' },
    { id: 'piggy-bank', label: 'Savings Bank', icon: CreditCard, path: '/piggy-bank' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handlePaymentConnect = (paymentData: any) => {
    // Update user payment information
    // In a real app, you would update the user state properly
    console.log('Payment method connected:', paymentData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PayEase
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4">
          {/* User Info */}
          <div 
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50 mb-6 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all"
            onClick={() => {
              navigate('/profile');
              setSidebarOpen(false);
            }}
          >
            <Avatar className="ring-2 ring-blue-200 dark:ring-blue-800">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={user.isVerified ? 'default' : 'secondary'} 
                  className={`text-xs ${user.isVerified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}`}
                >
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </Badge>
                {user.creditScore && (
                  <span className="text-xs text-muted-foreground">
                    Credit: {user.creditScore}
                  </span>
                )}
              </div>
              {user.hasPaymentMethod && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
                    <Wallet className="w-3 h-3 mr-1" />
                    Payment Connected
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Payment Connection */}
          {!user.hasPaymentMethod && (
            <div className="mb-6">
              <PaymentConnect 
                onConnect={handlePaymentConnect} 
                variant="secondary"
              />
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={isActive(item.path) ? 'default' : 'ghost'}
                className={`w-full justify-start transition-all ${
                  isActive(item.path) 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-card/50 backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <h2 className="font-semibold capitalize">
              {location.pathname.split('/')[1]?.replace('-', ' ') || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationDropdown />
            <Avatar className="cursor-pointer ring-2 ring-border/50 hover:ring-blue-500/50 transition-all" onClick={() => navigate('/profile')}>
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6 bg-gradient-to-br from-background via-background to-accent/20 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}