import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { UserLayout } from './components/layouts/UserLayout';
import { MerchantLayout } from './components/layouts/MerchantLayout';
import { AuthPage } from './components/auth/AuthPage';

// User Pages
import { UserDashboard } from './components/user/UserDashboard';
import { OrdersPage } from './components/user/OrdersPage';
import { MarketplacePage } from './components/user/MarketplacePage';
import { PiggyBankPage } from './components/user/PiggyBankPage';
import { UserProfile } from './components/user/UserProfile';
import { NotificationsPage } from './components/user/NotificationsPage';

// Merchant Pages
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { ProductManagement } from './components/merchant/ProductManagement';
import { UserTracking } from './components/merchant/UserTracking';
import { MerchantAnalytics } from './components/merchant/MerchantAnalytics';
import { RiskDashboard } from './components/merchant/RiskDashboard';
import { MerchantProfile } from './components/merchant/MerchantProfile';

export default function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'customer' or 'merchant'
  const [isLoading, setIsLoading] = useState(true);

  // Mock authentication state
  useEffect(() => {
    const savedUser = localStorage.getItem('payease_user');
    const savedUserType = localStorage.getItem('payease_user_type');
    
    // Simulate loading delay
    setTimeout(() => {
      if (savedUser && savedUserType) {
        setUser(JSON.parse(savedUser));
        setUserType(savedUserType);
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const handleLogin = (userData, type) => {
    setUser(userData);
    setUserType(type);
    localStorage.setItem('payease_user', JSON.stringify(userData));
    localStorage.setItem('payease_user_type', type);
  };

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('payease_user');
    localStorage.removeItem('payease_user_type');
  };

  // Loading state
  if (isLoading) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="payease-ui-theme">
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 via-yellow-50 via-emerald-50 via-cyan-50 via-indigo-50 to-purple-100 dark:from-rose-950 dark:via-orange-950 dark:via-yellow-950 dark:via-emerald-950 dark:via-cyan-950 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center relative overflow-hidden">
          {/* Enhanced Rainbow Animated Background */}
          <div className="absolute inset-0 opacity-40">
            {/* Rainbow orbs with different colors */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse float"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse float" style={{ animationDelay: '3s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse float" style={{ animationDelay: '4s' }}></div>
          </div>
          
          <div className="relative z-10 text-center space-y-8 glass rounded-3xl p-12 border border-white/20">
            {/* PayEase Logo */}
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-gradient-rainbow animate-pulse">PayEase</h1>
              <p className="text-lg text-gradient-sunset">Simplified Payments & BNPL</p>
            </div>
            
            {/* Rainbow Loading Animation */}
            <div className="relative">
              <div className="w-20 h-20 mx-auto relative">
                <div className="absolute inset-0 border-4 border-gray-200/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
                <div className="absolute inset-1 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-yellow-500 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
                <div className="absolute inset-3 border-4 border-transparent border-t-green-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-4 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDuration: '0.6s' }}></div>
                <div className="absolute inset-5 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.8s' }}></div>
              </div>
            </div>
            
            {/* Loading Text with Animation */}
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground loading-dots">Loading PayEase</p>
              <p className="text-sm text-muted-foreground">Setting up your financial dashboard</p>
            </div>
            
            {/* Rainbow Progress Indicator */}
            <div className="w-80 h-2 bg-gray-200/30 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-rainbow rounded-full animate-pulse loading-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Authentication flow
  if (!user || !userType) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="payease-ui-theme">
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 via-yellow-50 via-emerald-50 via-cyan-50 via-indigo-50 to-purple-100 dark:from-rose-950 dark:via-orange-950 dark:via-yellow-950 dark:via-emerald-950 dark:via-cyan-950 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
          {/* Enhanced Rainbow Background Animation */}
          <div className="absolute inset-0 opacity-25">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-red-400/40 via-orange-400/40 to-yellow-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float"></div>
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-r from-green-400/40 via-teal-400/40 to-cyan-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/40 via-indigo-400/40 to-purple-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/40 via-rose-400/40 to-fuchsia-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float" style={{ animationDelay: '3s' }}></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-r from-lime-400/40 via-emerald-400/40 to-teal-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float" style={{ animationDelay: '4s' }}></div>
            <div className="absolute top-3/4 right-1/3 w-72 h-72 bg-gradient-to-r from-amber-400/40 via-yellow-400/40 to-orange-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float" style={{ animationDelay: '5s' }}></div>
          </div>
          
          <div className="relative z-10">
            <AuthPage onLogin={handleLogin} />
          </div>
          <Toaster />
        </div>
      </ThemeProvider>
    );
  }

  // Main application
  return (
    <ThemeProvider defaultTheme="system" storageKey="payease-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-orange-50/50 via-yellow-50/50 via-emerald-50/50 via-cyan-50/50 via-indigo-50/50 to-purple-50/50 dark:from-rose-950/30 dark:via-orange-950/30 dark:via-yellow-950/30 dark:via-emerald-950/30 dark:via-cyan-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 transition-all duration-500 relative">
        {/* Subtle Rainbow Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-rainbow rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-ocean rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-sunset rounded-full filter blur-3xl"></div>
        </div>
        <Router>
          <Routes>
            {userType === 'customer' ? (
              <Route path="/*" element={<UserLayout user={user} onLogout={handleLogout} />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<UserDashboard user={user} />} />
                <Route path="orders" element={<OrdersPage user={user} />} />
                <Route path="marketplace" element={<MarketplacePage user={user} />} />
                <Route path="piggy-bank" element={<PiggyBankPage user={user} />} />
                <Route path="profile" element={<UserProfile user={user} />} />
                <Route path="notifications" element={<NotificationsPage user={user} />} />
                {/* Fallback route for unmatched paths */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            ) : (
              <Route path="/*" element={<MerchantLayout user={user} onLogout={handleLogout} />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<MerchantDashboard user={user} />} />
                <Route path="products" element={<ProductManagement user={user} />} />
                <Route path="users" element={<UserTracking user={user} />} />
                <Route path="analytics" element={<MerchantAnalytics user={user} />} />
                <Route path="risk" element={<RiskDashboard user={user} />} />
                <Route path="profile" element={<MerchantProfile user={user} />} />
                {/* Fallback route for unmatched paths */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            )}
          </Routes>
        </Router>
        
        {/* Enhanced Toast Notifications */}
        <Toaster 
          theme="system"
          position="top-right"
          expand={true}
          richColors={true}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--card)',
              color: 'var(--card-foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              backdropFilter: 'blur(12px)',
              boxShadow: 'var(--shadow-lg)',
            },
            className: 'transition-smooth',
          }}
        />
        
        {/* Enhanced Colorful Status Bar */}
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
          <div className="glass rounded-xl px-4 py-2 text-sm border border-white/30 bg-gradient-rainbow/10">
            <span className="text-gradient-rainbow font-bold">PayEase</span> • 
            <span className="text-gradient-success ml-1">Online</span>
            <div className="inline-block w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full ml-2 status-online shadow-lg shadow-green-400/50"></div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}