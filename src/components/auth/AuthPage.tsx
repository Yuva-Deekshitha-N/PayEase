import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { CreditCard, User, Store, Mail, Lock, Sparkles } from 'lucide-react';
import { PaymentConnect } from './PaymentConnect';
import { ThemeToggle } from '../theme/ThemeToggle';
import { MerchantSignupForm } from '../merchant/MerchantSignupForm';
import { toast } from 'sonner';

interface AuthPageProps {
  onLogin: (userData: any, userType: 'customer' | 'merchant') => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [showMerchantSignup, setShowMerchantSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    businessName: ''
  });

  const handlePaymentConnect = async (paymentData: any) => {
    setIsLoading(true);
    
    // Create user data based on payment connection
    const mockUserData = {
      id: Math.random().toString(36).substr(2, 9),
      name: activeTab === 'customer' ? 'Sarah Johnson' : 'TechMart Solutions',
      email: activeTab === 'customer' ? 'sarah.johnson@example.com' : 'admin@techmart.com',
      paymentMethodId: paymentData.methodId,
      paymentType: paymentData.type,
      paymentProvider: paymentData.provider,
      avatar: null, // Default to initials-based avatar
      creditScore: activeTab === 'customer' ? 750 : null,
      isVerified: false,
      emailVerified: false,
      phoneVerified: false,
      businessVerified: activeTab === 'merchant' ? false : null,
      businessName: activeTab === 'merchant' ? 'TechMart Solutions' : null,
      contactPerson: activeTab === 'merchant' ? 'Sarah Johnson' : null,
      phone: activeTab === 'merchant' ? '+1 (555) 123-4567' : null,
      hasPaymentMethod: true
    };

    // Simulate brief processing time
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Welcome! Redirecting to your ${activeTab} dashboard...`);
      onLogin(mockUserData, activeTab as 'customer' | 'merchant');
    }, 1000);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const mockUserData = {
      id: Math.random().toString(36).substr(2, 9),
      name: activeTab === 'customer' ? formData.name || 'Alex Thompson' : formData.businessName || 'Digital Commerce Co.',
      email: formData.email,
      paymentMethodId: null,
      paymentType: null,
      paymentProvider: null,
      avatar: null, // Default to initials-based avatar
      creditScore: activeTab === 'customer' ? 750 : null,
      isVerified: false,
      emailVerified: false,
      phoneVerified: false,
      businessVerified: activeTab === 'merchant' ? false : null,
      hasPaymentMethod: false
    };

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${isLogin ? 'Logged in' : 'Account created'} successfully! Redirecting to dashboard...`);
      onLogin(mockUserData, activeTab as 'customer' | 'merchant');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            PayEase
          </h1>
          <p className="text-muted-foreground">Buy Now, Pay Later - Secure & Simple</p>
        </div>

        {/* Main Card */}
        <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
              {!isLogin && <Sparkles className="w-5 h-5 text-yellow-500" />}
            </CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to your account' : 'Get started with flexible payments'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="customer" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <User className="w-4 h-4" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="merchant" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Store className="w-4 h-4" />
                  Merchant
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <PaymentConnect 
                    onConnect={handlePaymentConnect}
                    variant="primary"
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Enter your full name"
                          className="bg-input-background border-border/50"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Enter your email"
                        required
                        className="bg-input-background border-border/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Enter your password"
                        required
                        className="bg-input-background border-border/50"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-gradient"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          {isLogin ? 'Sign In' : 'Create Account'}
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="merchant" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <PaymentConnect 
                    onConnect={handlePaymentConnect}
                    variant="primary"
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          placeholder="Enter your business name"
                          className="bg-input-background border-border/50"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="merchant-email">Email</Label>
                      <Input
                        id="merchant-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Enter your business email"
                        required
                        className="bg-input-background border-border/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="merchant-password">Password</Label>
                      <Input
                        id="merchant-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Enter your password"
                        required
                        className="bg-input-background border-border/50"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-gradient"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Store className="w-4 h-4 mr-2" />
                          {isLogin ? 'Sign In' : 'Create Business Account'}
                        </>
                      )}
                    </Button>
                  </form>

                  {!isLogin && (
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs border-warning/50 text-warning bg-warning/10">
                        Business verification required after registration
                      </Badge>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm hover:bg-accent/50"
                disabled={isLoading}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Secure payments with advanced encryption and fraud protection
          </p>
        </div>
      </div>
    </div>
  );
}