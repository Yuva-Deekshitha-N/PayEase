import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Shield, 
  Mail, 
  Phone, 
  Building, 
  FileText, 
  Check, 
  Clock, 
  AlertTriangle,
  Upload,
  Loader2
} from 'lucide-react';
import { VerificationService } from './VerificationService';
import { toast } from 'sonner';

interface VerificationFlowProps {
  user: any;
  userType: 'customer' | 'merchant';
  onVerificationComplete?: () => void;
}

export function VerificationFlow({ user, userType, onVerificationComplete }: VerificationFlowProps) {
  const [currentStep, setCurrentStep] = useState<'email' | 'phone' | 'business'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessData, setBusinessData] = useState({
    businessType: '',
    businessAddress: '',
    gstNumber: '',
    businessRegistration: '',
    documents: [] as File[]
  });
  const [verificationStatus, setVerificationStatus] = useState({
    email: user.emailVerified || false,
    phone: user.phoneVerified || false,
    business: user.businessVerified || null
  });

  const verificationService = VerificationService.getInstance();

  const handleSendEmailOTP = async () => {
    setIsLoading(true);
    try {
      await verificationService.sendOTP('email', user.email);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    setIsLoading(true);
    try {
      await verificationService.verifyOTP('email', user.email, emailOTP);
      setVerificationStatus({ ...verificationStatus, email: true });
      toast.success('Email verified successfully!');
      if (userType === 'customer') {
        setCurrentStep('phone');
      } else {
        setCurrentStep('phone');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }
    setIsLoading(true);
    try {
      await verificationService.sendOTP('phone', phoneNumber);
      toast.success('OTP sent to your phone');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    setIsLoading(true);
    try {
      await verificationService.verifyOTP('phone', phoneNumber, phoneOTP);
      setVerificationStatus({ ...verificationStatus, phone: true });
      toast.success('Phone verified successfully!');
      if (userType === 'merchant') {
        setCurrentStep('business');
      } else {
        onVerificationComplete?.();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessVerification = async () => {
    setIsLoading(true);
    try {
      await verificationService.submitBusinessVerification(user.id, {
        ...businessData,
        status: 'pending'
      });
      setVerificationStatus({ ...verificationStatus, business: 'pending' });
      toast.success('Business verification submitted for review');
      onVerificationComplete?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setBusinessData({ ...businessData, documents: [...businessData.documents, ...files] });
  };

  const getStepStatus = (step: 'email' | 'phone' | 'business') => {
    const status = verificationStatus[step];
    if (status === true) return 'completed';
    if (status === 'pending') return 'pending';
    if (status === false || status === null) return 'incomplete';
    return 'incomplete';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-5 h-5 text-success" />;
      case 'pending': return <Clock className="w-5 h-5 text-warning" />;
      default: return <AlertTriangle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default" className="bg-success">Verified</Badge>;
      case 'pending': return <Badge variant="outline" className="border-warning text-warning">Pending</Badge>;
      default: return <Badge variant="secondary">Not Verified</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Account Verification
          </CardTitle>
          <CardDescription>
            Complete your account verification to secure your account and access all features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Verification Progress */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">Verify your email address</p>
              </div>
              {getStatusIcon(getStepStatus('email'))}
              {getStatusBadge(getStepStatus('email'))}
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Phone className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">Phone Verification</p>
                <p className="text-sm text-muted-foreground">Verify your phone number</p>
              </div>
              {getStatusIcon(getStepStatus('phone'))}
              {getStatusBadge(getStepStatus('phone'))}
            </div>

            {userType === 'merchant' && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Building className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">Business Verification</p>
                  <p className="text-sm text-muted-foreground">Verify your business credentials</p>
                </div>
                {getStatusIcon(getStepStatus('business'))}
                {getStatusBadge(getStepStatus('business'))}
              </div>
            )}
          </div>

          {/* Email Verification */}
          {currentStep === 'email' && !verificationStatus.email && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Email Verification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We'll send a verification code to {user.email}
                </p>
                <Button onClick={handleSendEmailOTP} disabled={isLoading} className="mb-4">
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                  Send Email OTP
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-otp">Enter OTP</Label>
                <div className="flex gap-2">
                  <Input
                    id="email-otp"
                    placeholder="123456"
                    value={emailOTP}
                    onChange={(e) => setEmailOTP(e.target.value)}
                    maxLength={6}
                  />
                  <Button onClick={handleVerifyEmailOTP} disabled={isLoading || !emailOTP}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Phone Verification */}
          {currentStep === 'phone' && !verificationStatus.phone && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Phone Verification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your phone number to receive a verification code
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Button onClick={handleSendPhoneOTP} disabled={isLoading || !phoneNumber}>
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Phone className="w-4 h-4 mr-2" />}
                    Send OTP
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-otp">Enter OTP</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone-otp"
                    placeholder="123456"
                    value={phoneOTP}
                    onChange={(e) => setPhoneOTP(e.target.value)}
                    maxLength={6}
                  />
                  <Button onClick={handleVerifyPhoneOTP} disabled={isLoading || !phoneOTP}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Business Verification */}
          {currentStep === 'business' && userType === 'merchant' && verificationStatus.business !== 'pending' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Business Verification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please provide your business information for verification
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-type">Business Type</Label>
                  <Select value={businessData.businessType} onValueChange={(value) => 
                    setBusinessData({ ...businessData, businessType: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private-limited">Private Limited Company</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gst-number">GST Number (Optional)</Label>
                  <Input
                    id="gst-number"
                    placeholder="22AAAAA0000A1Z5"
                    value={businessData.gstNumber}
                    onChange={(e) => setBusinessData({ ...businessData, gstNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-registration">Business Registration Number</Label>
                <Input
                  id="business-registration"
                  placeholder="Enter registration number"
                  value={businessData.businessRegistration}
                  onChange={(e) => setBusinessData({ ...businessData, businessRegistration: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-address">Business Address</Label>
                <Textarea
                  id="business-address"
                  placeholder="Enter complete business address"
                  value={businessData.businessAddress}
                  onChange={(e) => setBusinessData({ ...businessData, businessAddress: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documents">Supporting Documents</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload business registration certificate, GST certificate, or other documents
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <Label htmlFor="document-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Choose Files</span>
                    </Button>
                  </Label>
                  {businessData.documents.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {businessData.documents.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleBusinessVerification} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                Submit for Verification
              </Button>
            </div>
          )}

          {/* Completion Message */}
          {((userType === 'customer' && verificationStatus.email && verificationStatus.phone) ||
            (userType === 'merchant' && verificationStatus.email && verificationStatus.phone && verificationStatus.business)) && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verification Complete!</h3>
              <p className="text-muted-foreground">
                {userType === 'customer' 
                  ? 'Your account is now verified and secure.'
                  : 'Your business verification is under review. You can start using basic features.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}