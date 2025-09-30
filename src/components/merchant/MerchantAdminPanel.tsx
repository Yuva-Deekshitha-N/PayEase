import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Building,
  CreditCard,
  Globe,
  Instagram,
  FileText,
  AlertTriangle,
  TrendingUp,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { merchantVerificationService, MerchantVerificationStatus } from './MerchantVerificationService';

export function MerchantAdminPanel() {
  const [merchants, setMerchants] = useState<MerchantVerificationStatus[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantVerificationStatus | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPendingMerchants();
  }, []);

  const loadPendingMerchants = () => {
    const pendingMerchants = merchantVerificationService.getMerchantsPendingReview();
    setMerchants(pendingMerchants);
  };

  const handleApprove = async (merchantId: string) => {
    setIsLoading(true);
    try {
      await merchantVerificationService.approveMerchant(merchantId, 'admin@payease.com');
      toast.success('Merchant approved successfully');
      loadPendingMerchants();
    } catch (error) {
      toast.error('Failed to approve merchant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (merchantId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setIsLoading(true);
    try {
      await merchantVerificationService.rejectMerchant(merchantId, rejectionReason, 'admin@payease.com');
      toast.success('Merchant rejected');
      setRejectionReason('');
      setSelectedMerchant(null);
      loadPendingMerchants();
    } catch (error) {
      toast.error('Failed to reject merchant');
    } finally {
      setIsLoading(false);
    }
  };

  const getCheckIcon = (status: 'passed' | 'failed' | 'pending' | 'skipped') => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'skipped': return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getCheckColor = (status: 'passed' | 'failed' | 'pending' | 'skipped') => {
    switch (status) {
      case 'passed': return 'bg-green-50 border-green-200 text-green-700';
      case 'failed': return 'bg-red-50 border-red-200 text-red-700';
      case 'pending': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'skipped': return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Merchant Verification Admin</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve merchant applications
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {merchants.length} Pending Review
        </Badge>
      </div>

      {merchants.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No pending applications</h3>
            <p className="text-muted-foreground">All merchant applications have been reviewed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {merchants.map((merchant) => (
            <Card key={merchant.merchantId} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      {merchant.signupData.businessName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span>ID: {merchant.merchantId}</span>
                      <span>Submitted: {formatDate(merchant.submittedAt)}</span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Trust Score</span>
                    </div>
                    <div className={`text-2xl font-bold ${getTrustScoreColor(merchant.trustScore)}`}>
                      {merchant.trustScore}/10
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Business Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Contact:</span>
                      <span>{merchant.signupData.contactPersonName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">Email:</span>
                      <span>{merchant.signupData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">Phone:</span>
                      <span>{merchant.signupData.contactPhone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {merchant.signupData.businessAddress && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span className="font-medium">Address:</span>
                        <span className="text-xs">{merchant.signupData.businessAddress}</span>
                      </div>
                    )}
                    {merchant.signupData.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4" />
                        <span className="font-medium">Website:</span>
                        <span className="text-xs">{merchant.signupData.website}</span>
                      </div>
                    )}
                    {merchant.signupData.instagram && (
                      <div className="flex items-center gap-2 text-sm">
                        <Instagram className="w-4 h-4" />
                        <span className="font-medium">Instagram:</span>
                        <span className="text-xs">{merchant.signupData.instagram}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Verification Checks */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Automated Verification Checks
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Badge variant="outline" className={getCheckColor(merchant.checks.emailDomain)}>
                      {getCheckIcon(merchant.checks.emailDomain)}
                      <span className="ml-2">Email Domain</span>
                    </Badge>
                    <Badge variant="outline" className={getCheckColor(merchant.checks.phoneOtp)}>
                      {getCheckIcon(merchant.checks.phoneOtp)}
                      <span className="ml-2">Phone OTP</span>
                    </Badge>
                    <Badge variant="outline" className={getCheckColor(merchant.checks.pennyDrop)}>
                      {getCheckIcon(merchant.checks.pennyDrop)}
                      <span className="ml-2">Bank Verification</span>
                    </Badge>
                    <Badge variant="outline" className={getCheckColor(merchant.checks.idFileUploaded)}>
                      {getCheckIcon(merchant.checks.idFileUploaded)}
                      <span className="ml-2">ID Document</span>
                    </Badge>
                    <Badge variant="outline" className={getCheckColor(merchant.checks.blacklistCheck)}>
                      {getCheckIcon(merchant.checks.blacklistCheck)}
                      <span className="ml-2">Blacklist Check</span>
                    </Badge>
                  </div>
                </div>

                {/* Financial Info */}
                {(merchant.signupData.bankAccountNumber || merchant.signupData.gstinOrTaxId) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Financial Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {merchant.signupData.bankAccountNumber && (
                          <div>
                            <span className="font-medium">Bank Account:</span>
                            <span className="ml-2">****{merchant.signupData.bankAccountNumber.slice(-4)}</span>
                          </div>
                        )}
                        {merchant.signupData.ifscCode && (
                          <div>
                            <span className="font-medium">IFSC/Routing:</span>
                            <span className="ml-2">{merchant.signupData.ifscCode}</span>
                          </div>
                        )}
                        {merchant.signupData.gstinOrTaxId && (
                          <div>
                            <span className="font-medium">GST/Tax ID:</span>
                            <span className="ml-2">{merchant.signupData.gstinOrTaxId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Merchant Application Details</DialogTitle>
                        <DialogDescription>
                          Complete information for {merchant.signupData.businessName}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
                          {JSON.stringify(merchant.signupData, null, 2)}
                        </pre>
                        {merchant.signupData.idProofFile && (
                          <div className="p-4 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span className="text-sm font-medium">ID Proof Document:</span>
                              <span className="text-sm">{merchant.signupData.idProofFile.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={() => handleApprove(merchant.merchantId)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        onClick={() => setSelectedMerchant(merchant)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Merchant Application</DialogTitle>
                        <DialogDescription>
                          Please provide a reason for rejecting {merchant.signupData.businessName}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="rejectionReason">Rejection Reason</Label>
                          <Textarea
                            id="rejectionReason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Explain why this application is being rejected..."
                            className="mt-1"
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setRejectionReason('');
                              setSelectedMerchant(null);
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => selectedMerchant && handleReject(selectedMerchant.merchantId)}
                            disabled={!rejectionReason.trim() || isLoading}
                            className="flex-1"
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              'Confirm Rejection'
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}