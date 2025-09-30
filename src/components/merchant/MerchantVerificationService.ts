// Merchant Verification Service for PayEase
// Handles merchant signup, verification, and approval flow

export interface MerchantSignupData {
  // Required fields
  businessName: string;
  contactPersonName: string;
  contactPhone: string;
  email: string;
  
  // Optional fields
  bankAccountNumber?: string;
  ifscCode?: string;
  routingNumber?: string;
  idProofFile?: File;
  gstinOrTaxId?: string;
  businessAddress?: string;
  website?: string;
  instagram?: string;
}

export interface MerchantVerificationStatus {
  merchantId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  
  // Automated checks
  checks: {
    emailDomain: 'passed' | 'failed' | 'pending';
    phoneOtp: 'passed' | 'failed' | 'pending';
    pennyDrop: 'passed' | 'failed' | 'pending' | 'skipped';
    idFileUploaded: 'passed' | 'failed' | 'pending';
    blacklistCheck: 'passed' | 'failed' | 'pending';
  };
  
  // Trust score (1-10)
  trustScore: number;
  
  // Verification data
  signupData: MerchantSignupData;
}

export interface BlacklistEntry {
  type: 'email' | 'phone';
  value: string;
  reason: string;
  addedAt: Date;
}

export class MerchantVerificationService {
  private static instance: MerchantVerificationService;
  private merchants: Map<string, MerchantVerificationStatus> = new Map();
  private blacklist: BlacklistEntry[] = [
    // Demo blacklist data
    { type: 'email', value: 'spam@example.com', reason: 'Fraudulent activity', addedAt: new Date('2024-01-01') },
    { type: 'phone', value: '+1555000000', reason: 'Multiple failed verifications', addedAt: new Date('2024-01-15') },
    { type: 'email', value: 'fraud@test.com', reason: 'Suspected fraud', addedAt: new Date('2024-02-01') }
  ];

  private constructor() {}

  public static getInstance(): MerchantVerificationService {
    if (!MerchantVerificationService.instance) {
      MerchantVerificationService.instance = new MerchantVerificationService();
    }
    return MerchantVerificationService.instance;
  }

  // Submit merchant verification
  public async submitMerchantVerification(signupData: MerchantSignupData): Promise<string> {
    const merchantId = this.generateMerchantId();
    
    const verificationStatus: MerchantVerificationStatus = {
      merchantId,
      status: 'pending',
      submittedAt: new Date(),
      checks: {
        emailDomain: 'pending',
        phoneOtp: 'pending',
        pennyDrop: 'pending',
        idFileUploaded: 'pending',
        blacklistCheck: 'pending'
      },
      trustScore: 0,
      signupData
    };

    this.merchants.set(merchantId, verificationStatus);

    // Run automated checks
    await this.runAutomatedChecks(merchantId);

    return merchantId;
  }

  // Run automated verification checks
  private async runAutomatedChecks(merchantId: string): Promise<void> {
    const merchant = this.merchants.get(merchantId);
    if (!merchant) return;

    let trustScore = 0;

    // 1. Email domain check
    const emailDomainScore = this.checkEmailDomain(merchant.signupData.email);
    merchant.checks.emailDomain = emailDomainScore.passed ? 'passed' : 'failed';
    trustScore += emailDomainScore.score;

    // 2. Blacklist check
    const blacklistPassed = this.checkBlacklist(merchant.signupData.email, merchant.signupData.contactPhone);
    merchant.checks.blacklistCheck = blacklistPassed ? 'passed' : 'failed';
    if (blacklistPassed) trustScore += 2;

    // 3. ID file check
    const hasIdFile = merchant.signupData.idProofFile !== undefined;
    merchant.checks.idFileUploaded = hasIdFile ? 'passed' : 'failed';
    if (hasIdFile) trustScore += 2;

    // 4. Phone OTP (simulated - would be done in verification flow)
    // For demo, we'll mark as pending until OTP is verified
    merchant.checks.phoneOtp = 'pending';

    // 5. Penny drop simulation
    if (merchant.signupData.bankAccountNumber && merchant.signupData.ifscCode) {
      const pennyDropResult = await this.simulatePennyDrop(
        merchant.signupData.bankAccountNumber,
        merchant.signupData.ifscCode
      );
      merchant.checks.pennyDrop = pennyDropResult ? 'passed' : 'failed';
      if (pennyDropResult) trustScore += 2;
    } else {
      merchant.checks.pennyDrop = 'skipped';
    }

    // Additional trust score factors
    if (merchant.signupData.gstinOrTaxId) trustScore += 1;
    if (merchant.signupData.website) trustScore += 1;
    if (merchant.signupData.businessAddress) trustScore += 1;

    merchant.trustScore = Math.min(trustScore, 10);
    this.merchants.set(merchantId, merchant);
  }

  // Check email domain for business email
  private checkEmailDomain(email: string): { passed: boolean; score: number } {
    const domain = email.split('@')[1];
    const businessDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    
    if (businessDomains.includes(domain.toLowerCase())) {
      return { passed: true, score: 1 }; // Personal email allowed but lower score
    } else {
      return { passed: true, score: 2 }; // Business email gets higher score
    }
  }

  // Check against blacklist
  private checkBlacklist(email: string, phone: string): boolean {
    return !this.blacklist.some(entry => 
      (entry.type === 'email' && entry.value === email) ||
      (entry.type === 'phone' && entry.value === phone)
    );
  }

  // Simulate penny drop verification
  private async simulatePennyDrop(accountNumber: string, ifscCode: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, randomly succeed/fail based on account number
    const lastDigit = parseInt(accountNumber.slice(-1));
    return lastDigit % 2 === 0; // Even numbers succeed
  }

  // Mark phone OTP as verified
  public async verifyMerchantPhone(merchantId: string): Promise<void> {
    const merchant = this.merchants.get(merchantId);
    if (merchant) {
      merchant.checks.phoneOtp = 'passed';
      merchant.trustScore += 2;
      this.merchants.set(merchantId, merchant);
    }
  }

  // Get merchant verification status
  public getMerchantVerificationStatus(merchantId: string): MerchantVerificationStatus | null {
    return this.merchants.get(merchantId) || null;
  }

  // Get all merchants pending review
  public getMerchantsPendingReview(): MerchantVerificationStatus[] {
    return Array.from(this.merchants.values())
      .filter(merchant => merchant.status === 'pending')
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  // Admin approve merchant
  public async approveMerchant(merchantId: string, reviewerId: string): Promise<void> {
    const merchant = this.merchants.get(merchantId);
    if (merchant) {
      merchant.status = 'approved';
      merchant.reviewedAt = new Date();
      merchant.reviewedBy = reviewerId;
      this.merchants.set(merchantId, merchant);

      // Send approval email (simulated)
      await this.sendApprovalEmail(merchant);
    }
  }

  // Admin reject merchant
  public async rejectMerchant(merchantId: string, reason: string, reviewerId: string): Promise<void> {
    const merchant = this.merchants.get(merchantId);
    if (merchant) {
      merchant.status = 'rejected';
      merchant.rejectionReason = reason;
      merchant.reviewedAt = new Date();
      merchant.reviewedBy = reviewerId;
      this.merchants.set(merchantId, merchant);

      // Send rejection email (simulated)
      await this.sendRejectionEmail(merchant);
    }
  }

  // Check if merchant can list products
  public canMerchantListProducts(merchantId: string): boolean {
    const merchant = this.getMerchantVerificationStatus(merchantId);
    return merchant?.status === 'approved';
  }

  // Get merchant trust score
  public getMerchantTrustScore(merchantId: string): number {
    const merchant = this.getMerchantVerificationStatus(merchantId);
    return merchant?.trustScore || 0;
  }

  // Private helper methods
  private generateMerchantId(): string {
    return 'MERCH_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  private async sendApprovalEmail(merchant: MerchantVerificationStatus): Promise<void> {
    // Simulate email sending
    console.log(`Sending approval email to ${merchant.signupData.email}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async sendRejectionEmail(merchant: MerchantVerificationStatus): Promise<void> {
    // Simulate email sending
    console.log(`Sending rejection email to ${merchant.signupData.email} - Reason: ${merchant.rejectionReason}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Add to blacklist (admin function)
  public addToBlacklist(type: 'email' | 'phone', value: string, reason: string): void {
    this.blacklist.push({
      type,
      value,
      reason,
      addedAt: new Date()
    });
  }

  // Get blacklist (admin function)
  public getBlacklist(): BlacklistEntry[] {
    return [...this.blacklist];
  }
}

export const merchantVerificationService = MerchantVerificationService.getInstance();