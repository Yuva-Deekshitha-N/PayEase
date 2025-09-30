import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Shield, 
  Bell,
  Wallet,
  TrendingUp,
  Calendar,
  Edit,
  Globe,
  Instagram,
  CreditCard,
  FileText,
  DollarSign
} from 'lucide-react';
import { ProfilePhotoManager } from '../shared/ProfilePhotoManager';
import { toast } from 'sonner';

interface MerchantProfileProps {
  user: any;
}

export function MerchantProfile({ user }: MerchantProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user.avatar);
  const [notifications, setNotifications] = useState({
    payments: true,
    orders: true,
    marketing: false,
    security: true
  });

  const handleProfilePhotoChange = (newPhotoUrl: string | null) => {
    setProfilePhoto(newPhotoUrl);
    // In a real app, this would update the user data
    user.avatar = newPhotoUrl;
    toast.success('Profile photo updated successfully');
  };

  const businessMetrics = {
    totalRevenue: 45240,
    monthlyGrowth: 12.5,
    activeProducts: 24,
    totalOrders: 152,
    approvalRate: 95
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Business Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your merchant account and business settings
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
        {/* Business Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Your merchant account details and verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <ProfilePhotoManager
                currentPhoto={profilePhoto}
                userName={user.businessName || user.name}
                onPhotoChange={handleProfilePhotoChange}
                size="xl"
              />
              <div>
                <h3 className="text-lg font-semibold">{user.businessName || user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user.businessVerified ? 'default' : 'secondary'}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.businessVerified ? 'Business Verified' : 'Verification Pending'}
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
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  defaultValue={user.businessName || user.name}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  defaultValue={user.contactPerson || user.name}
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
                  defaultValue={user.phone || "+1 (555) 123-4567"}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-business.com"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gstTax">GST/Tax ID</Label>
                <Input
                  id="gstTax"
                  placeholder="Your tax identification"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                placeholder="Full business address"
                disabled={!isEditing}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Business Verification Status */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Verification Status</h4>
                <Badge variant={user.businessVerified ? 'default' : 'secondary'}>
                  {user.businessVerified ? 'Verified' : 'Pending Review'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.phoneVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Phone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.bankVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Bank</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.documentsVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Documents</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Business Metrics
            </CardTitle>
            <CardDescription>Your performance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="font-semibold">${businessMetrics.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Growth</p>
                  <p className="font-semibold text-green-600">+{businessMetrics.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Active Products</p>
                  <p className="font-semibold">{businessMetrics.activeProducts}</p>
                </div>
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="font-semibold">{businessMetrics.totalOrders}</p>
                </div>
                <FileText className="w-5 h-5 text-purple-600" />
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Approval Rate</p>
                  <p className="font-semibold text-green-600">{businessMetrics.approvalRate}%</p>
                </div>
                <Shield className="w-5 h-5 text-green-600" />
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment & Financial */}
        <Card>
          <CardHeader>
            <CardTitle>Payment & Financial</CardTitle>
            <CardDescription>Manage your payment methods and financial information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankAccount">Bank Account</Label>
                <Input
                  id="bankAccount"
                  placeholder="Account Number"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ifscCode">IFSC/Routing Code</Label>
                <Input
                  id="ifscCode"
                  placeholder="IFSC or Routing Number"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium">Payment Processing</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Your payment processing is enabled and ready for transactions.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>BNPL Enabled</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Instant Settlements</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your notification and business settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payment-notifications">Payment Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive payment and settlement notifications</p>
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
                    <Label htmlFor="order-notifications">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">New orders and customer interactions</p>
                  </div>
                  <Switch 
                    id="order-notifications"
                    checked={notifications.orders} 
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, orders: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-notifications">Marketing</Label>
                    <p className="text-sm text-muted-foreground">Feature updates and business tips</p>
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
                    <p className="text-sm text-muted-foreground">Account security and risk notifications</p>
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

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Business Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-approve small orders</Label>
                    <p className="text-sm text-muted-foreground">Orders under $100</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Risk monitoring</Label>
                    <p className="text-sm text-muted-foreground">Enhanced fraud detection</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}