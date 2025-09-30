import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Upload, 
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Globe,
  Instagram,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { merchantVerificationService, MerchantSignupData } from './MerchantVerificationService';
import { verificationService } from '../auth/VerificationService';

interface MerchantSignupFormProps {
  onSignupComplete: (merchantId: string) => void;
}

export function MerchantSignupForm({ onSignupComplete }: MerchantSignupFormProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [formData, setFormData] = useState<MerchantSignupData>({
    businessName: '',
    contactPersonName: '',
    contactPhone: '',
    email: '',
    bankAccountNumber: '',
    ifscCode: '',
    routingNumber: '',
    gstinOrTaxId: '',
    businessAddress: '',
    website: '',
    instagram: ''
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleInputChange = (field: keyof MerchantSignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPEG, PNG, or PDF file');
        return;
      }

      setFormData(prev => ({ ...prev, idProofFile: file }));
      toast.success('ID proof uploaded successfully');
    }
  };

  const handleSendOTP = async () => {
    if (!formData.contactPhone) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      await verificationService.sendOTP('phone', formData.contactPhone);
      setOtpSent(true);
      toast.success('OTP sent to your phone');
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      await verificationService.verifyOTP('phone', formData.contactPhone, otpCode);
      toast.success('Phone verified successfully');
      setStep(2);
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    // Validate required fields for step 1
    if (step === 1) {
      if (!formData.businessName || !formData.contactPersonName || !formData.email || !formData.contactPhone) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (!otpSent) {
        toast.error('Please verify your phone number');
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const merchantId = await merchantVerificationService.submitMerchantVerification(formData);
      
      // Mark phone as verified in merchant verification
      await merchantVerificationService.verifyMerchantPhone(merchantId);
      
      toast.success('Application submitted successfully! You will receive an email once reviewed.');
      onSignupComplete(merchantId);
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Store className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Business Information</h2>
        <p className="text-muted-foreground">Required information to get started</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            placeholder="Enter your business name"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="contactPersonName">Contact Person Name *</Label>
          <Input
            id="contactPersonName"
            value={formData.contactPersonName}
            onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
            placeholder="Your full name"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="business@company.com (business email preferred)"
            className="mt-1"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Business email domains get higher trust scores
          </p>
        </div>

        <div>
          <Label htmlFor="contactPhone">Phone Number *</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="flex-1"
              required
            />
            {!otpSent ? (
              <Button 
                onClick={handleSendOTP} 
                disabled={!formData.contactPhone || isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-600/30 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  'Send OTP'
                )}
              </Button>
            ) : (
              <Badge variant="default" className="px-3 py-2">
                <CheckCircle className="w-4 h-4 mr-1" />
                Sent
              </Badge>
            )}
          </div>
        </div>

        {otpSent && (
          <div>
            <Label htmlFor="otpCode">Verification Code</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="otpCode"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="flex-1"
                maxLength={6}
              />
              <Button onClick={handleVerifyOTP} disabled={!otpCode || isLoading}>
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Financial & Legal Details</h2>
        <p className="text-muted-foreground">Optional but helps with verification</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
            <Input
              id="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
              placeholder="Your business account"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ifscCode">IFSC Code / Routing Number</Label>
            <Input
              id="ifscCode"
              value={formData.ifscCode}
              onChange={(e) => handleInputChange('ifscCode', e.target.value)}
              placeholder="IFSC or routing number"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="gstinOrTaxId">GSTIN / Tax ID</Label>
          <Input
            id="gstinOrTaxId"
            value={formData.gstinOrTaxId}
            onChange={(e) => handleInputChange('gstinOrTaxId', e.target.value)}
            placeholder="Your GST or Tax identification number"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="businessAddress">Business Address</Label>
          <Textarea
            id="businessAddress"
            value={formData.businessAddress}
            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            placeholder="Full business address"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label>ID Proof Upload</Label>
          <div className="mt-1">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload ID proof (Aadhaar, Passport, or Company Document)
              </p>
              <input
                type="file"
                id="idProof"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
              />
              <label htmlFor="idProof">
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
              {formData.idProofFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {formData.idProofFile.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Online Presence</h2>
        <p className="text-muted-foreground">Optional but builds trust</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="website">Website URL</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://your-website.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="instagram">Instagram Handle</Label>
          <Input
            id="instagram"
            value={formData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
            placeholder="@your_business_handle"
            className="mt-1"
          />
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">What happens next?</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Automated verification checks will run</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Manual review by our team (usually within 24 hours)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Email notification with approval/rejection</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Merchant Registration</CardTitle>
              <CardDescription>
                Step {step} of {totalSteps} - Complete your business verification
              </CardDescription>
            </div>
            <Badge variant="outline">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>

        <CardContent>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <Separator className="my-6" />

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(prev => prev - 1)}
              disabled={step <= 1}
            >
              Previous
            </Button>

            {step < totalSteps ? (
              <Button onClick={handleNext}>
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Submit for Review
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}