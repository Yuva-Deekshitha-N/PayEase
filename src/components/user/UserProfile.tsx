import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Shield, 
  Bell,
  Wallet,
  TrendingUp,
  Calendar,
  Edit
} from 'lucide-react';
import { PaymentConnect } from '../auth/PaymentConnect';
import { ProfilePhotoManager } from '../shared/ProfilePhotoManager';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { toast } from 'sonner';

interface UserProfileProps {
  user: any;
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [locationConsent, setLocationConsent] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(user.avatar);
  const [notifications, setNotifications] = useState({
    payments: true,
    marketing: false,
    security: true
  });

  const handleProfilePhotoChange = (newPhotoUrl: string | null) => {
    setProfilePhoto(newPhotoUrl);
    // In a real app, this would update the user data
    user.avatar = newPhotoUrl;
    toast.success('Profile photo updated successfully');
  };

  const creditScore = user.creditScore || 750;
  const creditScoreMax = 850;
  const creditScoreChange = +12;

  const paymentHistory = [
    { month: 'Aug 2025', onTime: 3, late: 0, total: 3 },
    { month: 'Jul 2025', onTime: 4, late: 1, total: 5 },
    { month: 'Jun 2025', onTime: 2, late: 0, total: 2 },
    { month: 'May 2025', onTime: 3, late: 0, total: 3 },
    { month: 'Apr 2025', onTime: 1, late: 1, total: 2 }
  ];

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return '#22c55e'; // green
    if (score >= 700) return '#eab308'; // yellow
    if (score >= 650) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Profile & Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account information and preferences
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="w-4 h-4 mr-2" />
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details and verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <ProfilePhotoManager
                currentPhoto={profilePhoto}
                userName={user.name}
                onPhotoChange={handleProfilePhotoChange}
                size="xl"
              />
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user.isVerified ? 'default' : 'secondary'}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                  {user.emailVerified && (
                    <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                      <Mail className="w-3 h-3 mr-1" />
                      Email Verified
                    </Badge>
                  )}
                  {user.hasPaymentMethod && (
                    <Badge variant="outline">
                      <Wallet className="w-3 h-3 mr-1" />
                      Payment Connected
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  defaultValue={user.name}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user.email}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="New York, NY"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Payment Methods</h4>
                {user.hasPaymentMethod && (
                  <Badge variant="default">Connected</Badge>
                )}
              </div>
              {user.hasPaymentMethod ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    You have payment methods connected for secure BNPL transactions.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Wallet className="w-3 h-3 mr-1" />
                      {user.paymentType || 'Payment Method'} Connected
                    </Badge>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect your payment methods for secure BNPL transactions
                  </p>
                  <PaymentConnect onConnect={() => {}} variant="secondary" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Credit Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Credit Score
            </CardTitle>
            <CardDescription>Your BNPL credit rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto">
                <CircularProgressbar
                  value={(creditScore / creditScoreMax) * 100}
                  text={creditScore.toString()}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: getCreditScoreColor(creditScore),
                    textColor: getCreditScoreColor(creditScore),
                    trailColor: '#e5e7eb'
                  })}
                />
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold" style={{ color: getCreditScoreColor(creditScore) }}>
                  {getCreditScoreLabel(creditScore)}
                </div>
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  +{creditScoreChange} this month
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment History</span>
                  <span className="text-green-600">98%</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Accounts</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between">
                  <span>Credit Utilization</span>
                  <span className="text-green-600">12%</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Credit Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent payment performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{record.month}</p>
                    <p className="text-sm text-muted-foreground">{record.total} payments</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{record.onTime}</div>
                      <div className="text-xs text-muted-foreground">On Time</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${record.late > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {record.late}
                      </div>
                      <div className="text-xs text-muted-foreground">Late</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your notification and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="location-consent">Location Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow location-based features for risk assessment
                  </p>
                </div>
                <Switch 
                  id="location-consent"
                  checked={locationConsent} 
                  onCheckedChange={setLocationConsent}
                />
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment-notifications">Payment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Due date and overdue alerts</p>
                    </div>
                    <Switch 
                      id="payment-notifications"
                      checked={notifications.payments} 
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, payments: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-notifications">Marketing</Label>
                      <p className="text-sm text-muted-foreground">Deals and product updates</p>
                    </div>
                    <Switch 
                      id="marketing-notifications"
                      checked={notifications.marketing} 
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, marketing: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="security-notifications">Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Account and transaction security</p>
                    </div>
                    <Switch 
                      id="security-notifications"
                      checked={notifications.security} 
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, security: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Verification</CardTitle>
            <CardDescription>Secure your account with multiple verification methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="font-medium">Email Verification</p>
                  <p className="text-sm text-muted-foreground">Verify your email address</p>
                </div>
              </div>
              <Badge variant={user.emailVerified ? "default" : "secondary"} className={user.emailVerified ? "bg-success" : ""}>
                {user.emailVerified ? "Verified" : "Not Verified"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="font-medium">Phone Verification</p>
                  <p className="text-sm text-muted-foreground">Verify your phone number</p>
                </div>
              </div>
              <Badge variant={user.phoneVerified ? "default" : "secondary"} className={user.phoneVerified ? "bg-success" : ""}>
                {user.phoneVerified ? "Verified" : "Not Verified"}
              </Badge>
            </div>

            {(!user.emailVerified || !user.phoneVerified) && (
              <Button variant="outline" className="w-full" onClick={() => {
                // In a real app, this would open a verification flow
                alert('Verification flow would open here');
              }}>
                <Shield className="w-4 h-4 mr-2" />
                Complete Verification
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}