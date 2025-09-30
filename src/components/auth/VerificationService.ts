// Verification Service for PayEase
// Handles email/phone OTP and business verification

export interface OTPVerification {
  type: 'email' | 'phone';
  value: string;
  code: string;
  expiresAt: Date;
  isVerified: boolean;
  attempts: number;
}

export interface BusinessVerification {
  gstNumber?: string;
  businessRegistration?: string;
  businessType: string;
  businessAddress: string;
  documents: File[];
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface SecurityCheck {
  ipAddress: string;
  deviceFingerprint: string;
  loginAttempts: number;
  lastLogin: Date;
  suspiciousActivity: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export class VerificationService {
  private static instance: VerificationService;
  private verifications: Map<string, OTPVerification> = new Map();
  private businessVerifications: Map<string, BusinessVerification> = new Map();
  private securityChecks: Map<string, SecurityCheck> = new Map();

  private constructor() {}

  public static getInstance(): VerificationService {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService();
    }
    return VerificationService.instance;
  }

  // Email/Phone OTP Verification
  public async sendOTP(type: 'email' | 'phone', value: string): Promise<string> {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    const verification: OTPVerification = {
      type,
      value,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isVerified: false,
      attempts: 0
    };

    const key = `${type}_${value}`;
    this.verifications.set(key, verification);

    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In development, show the code in console/alert
    if (process.env.NODE_ENV === 'development') {
      console.log(`OTP for ${type} ${value}: ${code}`);
      alert(`Development Mode - OTP: ${code}`);
    }

    return `OTP sent to your ${type}`;
  }

  public async verifyOTP(type: 'email' | 'phone', value: string, inputCode: string): Promise<boolean> {
    const key = `${type}_${value}`;
    const verification = this.verifications.get(key);

    if (!verification) {
      throw new Error('No verification request found');
    }

    verification.attempts++;

    if (verification.attempts > 3) {
      this.verifications.delete(key);
      throw new Error('Too many attempts. Please request a new OTP.');
    }

    if (new Date() > verification.expiresAt) {
      this.verifications.delete(key);
      throw new Error('OTP has expired. Please request a new one.');
    }

    if (verification.code !== inputCode) {
      throw new Error('Invalid OTP. Please try again.');
    }

    verification.isVerified = true;
    return true;
  }

  public isVerified(type: 'email' | 'phone', value: string): boolean {
    const key = `${type}_${value}`;
    const verification = this.verifications.get(key);
    return verification?.isVerified || false;
  }

  // Business Verification
  public async submitBusinessVerification(userId: string, data: BusinessVerification): Promise<void> {
    // Simulate business verification submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.businessVerifications.set(userId, {
      ...data,
      status: 'pending'
    });
  }

  public getBusinessVerificationStatus(userId: string): BusinessVerification | null {
    return this.businessVerifications.get(userId) || null;
  }

  public async approveBusinessVerification(userId: string): Promise<void> {
    const verification = this.businessVerifications.get(userId);
    if (verification) {
      verification.status = 'verified';
      this.businessVerifications.set(userId, verification);
    }
  }

  public async rejectBusinessVerification(userId: string, reason: string): Promise<void> {
    const verification = this.businessVerifications.get(userId);
    if (verification) {
      verification.status = 'rejected';
      verification.rejectionReason = reason;
      this.businessVerifications.set(userId, verification);
    }
  }

  // Security Checks
  public async performSecurityCheck(userId: string, ipAddress: string, deviceInfo: any): Promise<SecurityCheck> {
    const existing = this.securityChecks.get(userId);
    
    const check: SecurityCheck = {
      ipAddress,
      deviceFingerprint: this.generateDeviceFingerprint(deviceInfo),
      loginAttempts: (existing?.loginAttempts || 0) + 1,
      lastLogin: new Date(),
      suspiciousActivity: this.detectSuspiciousActivity(userId, ipAddress, existing),
      riskLevel: 'low'
    };

    // Determine risk level
    if (check.suspiciousActivity || check.loginAttempts > 5) {
      check.riskLevel = 'high';
    } else if (check.loginAttempts > 3) {
      check.riskLevel = 'medium';
    }

    this.securityChecks.set(userId, check);
    return check;
  }

  private generateDeviceFingerprint(deviceInfo: any): string {
    // Generate a simple device fingerprint
    const userAgent = navigator.userAgent;
    const screen = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return btoa(`${userAgent}_${screen}_${timezone}`).substring(0, 16);
  }

  private detectSuspiciousActivity(userId: string, ipAddress: string, existing: SecurityCheck | undefined): boolean {
    if (!existing) return false;

    // Check for different IP address in short time
    const timeDiff = Date.now() - existing.lastLogin.getTime();
    const differentIP = existing.ipAddress !== ipAddress;
    const shortTimeWindow = timeDiff < 5 * 60 * 1000; // 5 minutes

    return differentIP && shortTimeWindow;
  }

  public getSecurityCheck(userId: string): SecurityCheck | null {
    return this.securityChecks.get(userId) || null;
  }

  public clearSecurityCheck(userId: string): void {
    this.securityChecks.delete(userId);
  }

  // Fraud Prevention
  public async checkFraudRisk(userId: string, transactionAmount: number): Promise<{
    isApproved: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    reason?: string;
    creditLimit?: number;
  }> {
    const securityCheck = this.getSecurityCheck(userId);
    const businessVerification = this.getBusinessVerificationStatus(userId);

    // Mock fraud detection logic
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let isApproved = true;
    let reason = '';
    let creditLimit = 5000; // Default credit limit

    // Check security status
    if (securityCheck?.riskLevel === 'high') {
      riskLevel = 'high';
      isApproved = false;
      reason = 'High security risk detected';
    }

    // Check transaction amount
    if (transactionAmount > creditLimit) {
      riskLevel = 'high';
      isApproved = false;
      reason = 'Transaction amount exceeds credit limit';
    }

    // Check business verification for merchants
    if (businessVerification && businessVerification.status !== 'verified') {
      riskLevel = 'medium';
      creditLimit = 1000; // Lower limit for unverified businesses
    }

    return {
      isApproved,
      riskLevel,
      reason: reason || undefined,
      creditLimit
    };
  }
}

export const verificationService = VerificationService.getInstance();