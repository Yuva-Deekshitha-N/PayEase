import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  CreditCard,
  Building,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react';
import { VerificationService } from './VerificationService';

interface SecurityDashboardProps {
  user: any;
  userType: 'customer' | 'merchant';
}

export function SecurityDashboard({ user, userType }: SecurityDashboardProps) {
  const [securityScore, setSecurityScore] = useState(85);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [fraudAlerts, setFraudAlerts] = useState([
    {
      id: 1,
      type: 'info',
      message: 'New device login detected from Chrome on Windows',
      time: '2 hours ago',
      severity: 'low'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Unusual transaction pattern detected',
      time: '1 day ago',
      severity: 'medium'
    }
  ]);

  const verificationService = VerificationService.getInstance();
  
  const [creditLimits, setCreditLimits] = useState({
    current: userType === 'customer' ? 2500 : 15000,
    maximum: userType === 'customer' ? 5000 : 50000,
    available: userType === 'customer' ? 2500 : 15000
  });

  // Calculate security score based on verification status
  useEffect(() => {
    let score = 40; // Base score
    
    if (user.emailVerified) score += 20;
    if (user.phoneVerified) score += 20;
    if (user.hasPaymentMethod) score += 15;
    if (userType === 'merchant' && user.businessVerified) score += 20;
    if (user.isVerified) score += 10;

    setSecurityScore(Math.min(score, 100));
  }, [user, userType]);

  const getSecurityLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 70) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 50) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Poor', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const securityLevel = getSecurityLevel(securityScore);

  const handleFraudCheck = async () => {
    const riskCheck = await verificationService.checkFraudRisk(user.id, 1000);
    console.log('Fraud risk check:', riskCheck);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security & Fraud Prevention</h2>
          <p className="text-muted-foreground">
            Monitor your account security and manage verification status
          </p>
        </div>
        <Button onClick={handleFraudCheck} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Run Security Check
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: securityLevel.color.replace('text-', '') }}>
                  {securityScore}%
                </div>
                <Badge variant="outline" className={`${securityLevel.bgColor} ${securityLevel.color} border-current`}>
                  {securityLevel.level}
                </Badge>
              </div>
              
              <Progress value={securityScore} className="h-2" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Email Verification</span>
                  {user.emailVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Phone Verification</span>
                  {user.phoneVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  {user.hasPaymentMethod ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                {userType === 'merchant' && (
                  <div className="flex justify-between">
                    <span>Business Verification</span>
                    {user.businessVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Limits & Risk Assessment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5" />
              {userType === 'customer' ? 'BNPL Credit Limit' : 'Transaction Limits'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Available</span>
                  <span className="font-medium">${creditLimits.available.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current Limit</span>
                  <span className="font-medium">${creditLimits.current.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Maximum Possible</span>
                  <span className="text-muted-foreground">${creditLimits.maximum.toLocaleString()}</span>
                </div>
              </div>

              <Progress 
                value={(creditLimits.current / creditLimits.maximum) * 100} 
                className="h-2" 
              />

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Increase Your Limit
                  </span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Complete verification steps to unlock higher limits and better rates.
                </p>
              </div>

              <Button variant="outline" className="w-full">
                Request Limit Increase
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Security Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-5 h-5" />
              Security Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fraudAlerts.map((alert) => (
                <Alert key={alert.id} className={
                  alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                  alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    <div className="font-medium mb-1">{alert.message}</div>
                    <div className="text-xs text-muted-foreground">{alert.time}</div>
                  </AlertDescription>
                </Alert>
              ))}

              <div className="pt-2">
                <Button 
                  variant="ghost" 
                  className="w-full text-sm"
                  onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                >
                  {showSensitiveInfo ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Sensitive Info
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show All Activity
                    </>
                  )}
                </Button>
              </div>

              {showSensitiveInfo && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Last Login:</span>
                      <span>2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Device:</span>
                      <span>Chrome, Windows</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span>New York, US</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        Low
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Prevention Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Advanced Security Features
          </CardTitle>
          <CardDescription>
            Enhanced protection against fraud and unauthorized access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-medium">Real-time Monitoring</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Continuous monitoring of account activity and transaction patterns.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-medium">Multi-Factor Auth</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Email and phone verification for enhanced account security.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-medium">Credit Scoring</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Dynamic credit assessment based on payment history and behavior.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
                <h4 className="font-medium">Fraud Detection</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered detection of suspicious activities and transactions.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Building className="w-4 h-4 text-indigo-600" />
                </div>
                <h4 className="font-medium">Business KYC</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive business verification for merchant accounts.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <CreditCard className="w-4 h-4 text-pink-600" />
                </div>
                <h4 className="font-medium">Payment Security</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Encrypted payment processing with multiple security layers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}