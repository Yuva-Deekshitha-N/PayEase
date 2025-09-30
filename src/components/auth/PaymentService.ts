// General Payment Service for PayEase
// Supports multiple payment methods and secure transactions

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet' | 'crypto';
  name: string;
  last4?: string;
  expiryDate?: string;
  bankName?: string;
  walletProvider?: string;
  isDefault: boolean;
  isVerified: boolean;
}

export interface PaymentConnection {
  methods: PaymentMethod[];
  isConnecting: boolean;
  error: string | null;
  activeMethod: PaymentMethod | null;
}

export interface TransactionData {
  amount: number;
  currency: string;
  description: string;
  merchantId: string;
  customerId: string;
  paymentMethodId: string;
}

export class PaymentService {
  private static instance: PaymentService;
  private paymentMethods: PaymentMethod[] = [];
  private listeners: ((connection: PaymentConnection) => void)[] = [];

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public subscribe(listener: (connection: PaymentConnection) => void) {
    this.listeners.push(listener);
    // Send current state immediately
    listener(this.getConnectionState());
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    const state = this.getConnectionState();
    this.listeners.forEach(listener => listener(state));
  }

  private getConnectionState(): PaymentConnection {
    return {
      methods: this.paymentMethods,
      isConnecting: false,
      error: null,
      activeMethod: this.paymentMethods.find(m => m.isDefault) || null
    };
  }

  public async requestPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate permission request for payment access
      const granted = window.confirm(
        "PayEase would like to securely connect your payment methods.\n\nThis will allow the app to:\n• Securely store payment method information\n• Process BNPL transactions\n• Manage payment schedules\n• Send payment notifications\n\nDo you want to continue?"
      );
      
      setTimeout(() => resolve(granted), 500);
    });
  }

  public async connectPaymentMethod(type: 'card' | 'bank' | 'wallet' | 'crypto'): Promise<PaymentMethod> {
    this.notifyListeners();

    try {
      // Request permission first
      const permissionGranted = await this.requestPermission();
      
      if (!permissionGranted) {
        throw new Error('User denied payment method connection permission');
      }

      // Simulate payment method connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock payment method data based on type
      const newMethod: PaymentMethod = this.generateMockPaymentMethod(type);

      this.paymentMethods.push(newMethod);
      this.notifyListeners();
      return newMethod;

    } catch (error) {
      this.notifyListeners();
      throw error;
    }
  }

  private generateMockPaymentMethod(type: 'card' | 'bank' | 'wallet' | 'crypto'): PaymentMethod {
    const id = Math.random().toString(36).substr(2, 9);
    
    switch (type) {
      case 'card':
        return {
          id,
          type: 'card',
          name: 'Visa Credit Card',
          last4: Math.floor(Math.random() * 9000 + 1000).toString(),
          expiryDate: '12/26',
          isDefault: this.paymentMethods.length === 0,
          isVerified: true
        };
      
      case 'bank':
        const banks = ['Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank'];
        return {
          id,
          type: 'bank',
          name: 'Bank Account',
          bankName: banks[Math.floor(Math.random() * banks.length)],
          last4: Math.floor(Math.random() * 9000 + 1000).toString(),
          isDefault: this.paymentMethods.length === 0,
          isVerified: true
        };
      
      case 'wallet':
        const wallets = ['PayPal', 'Apple Pay', 'Google Pay', 'Samsung Pay'];
        return {
          id,
          type: 'wallet',
          name: wallets[Math.floor(Math.random() * wallets.length)],
          walletProvider: wallets[Math.floor(Math.random() * wallets.length)],
          isDefault: this.paymentMethods.length === 0,
          isVerified: true
        };
      
      case 'crypto':
        const cryptoWallets = ['MetaMask', 'Trust Wallet', 'Coinbase Wallet', 'Ledger Wallet'];
        return {
          id,
          type: 'crypto',
          name: 'Crypto Wallet',
          walletProvider: cryptoWallets[Math.floor(Math.random() * cryptoWallets.length)],
          isDefault: this.paymentMethods.length === 0,
          isVerified: true
        };
      
      default:
        throw new Error('Invalid payment method type');
    }
  }

  public async removePaymentMethod(methodId: string): Promise<void> {
    this.paymentMethods = this.paymentMethods.filter(m => m.id !== methodId);
    this.notifyListeners();
  }

  public setDefaultPaymentMethod(methodId: string): void {
    this.paymentMethods = this.paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === methodId
    }));
    this.notifyListeners();
  }

  public getPaymentMethods(): PaymentMethod[] {
    return this.paymentMethods;
  }

  public hasPaymentMethods(): boolean {
    return this.paymentMethods.length > 0;
  }

  public async processTransaction(transaction: TransactionData): Promise<string> {
    const activeMethod = this.paymentMethods.find(m => m.isDefault);
    
    if (!activeMethod) {
      throw new Error('No payment method available');
    }

    // Simulate transaction processing
    return new Promise((resolve, reject) => {
      const confirmed = window.confirm(
        `Process BNPL Transaction?\n\nAmount: ${transaction.currency} ${transaction.amount}\nPayment Method: ${activeMethod.name}\nDescription: ${transaction.description}\n\nThis will be split into installments.`
      );

      setTimeout(() => {
        if (confirmed) {
          resolve('mock_transaction_id_' + Date.now());
        } else {
          reject(new Error('Transaction cancelled by user'));
        }
      }, 1000);
    });
  }

  public async verifyPaymentMethod(methodId: string): Promise<boolean> {
    // Simulate verification process
    return new Promise((resolve) => {
      setTimeout(() => {
        this.paymentMethods = this.paymentMethods.map(method => 
          method.id === methodId ? { ...method, isVerified: true } : method
        );
        this.notifyListeners();
        resolve(true);
      }, 2000);
    });
  }
}

export const paymentService = PaymentService.getInstance();