import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  Bitcoin,
  Check,
  Loader2,
  Plus,
  Shield
} from 'lucide-react';
import { PaymentService, PaymentMethod, PaymentConnection } from './PaymentService';
import { toast } from 'sonner';

interface PaymentConnectProps {
  onConnect?: (paymentData: any) => void;
  variant?: 'primary' | 'secondary';
  showMultiple?: boolean;
}

export function PaymentConnect({ onConnect, variant = 'primary', showMultiple = false }: PaymentConnectProps) {
  const [connection, setConnection] = useState<PaymentConnection>({
    methods: [],
    isConnecting: false,
    error: null,
    activeMethod: null
  });
  const [selectedType, setSelectedType] = useState<'card' | 'bank' | 'wallet' | 'crypto' | null>(null);

  useEffect(() => {
    const paymentService = PaymentService.getInstance();
    const unsubscribe = paymentService.subscribe(setConnection);
    return unsubscribe;
  }, []);

  const handleConnect = async (type: 'card' | 'bank' | 'wallet' | 'crypto') => {
    setSelectedType(type);
    
    try {
      const paymentService = PaymentService.getInstance();
      const method = await paymentService.connectPaymentMethod(type);
      
      toast.success(`${getPaymentTypeName(type)} connected successfully!`);
      
      if (onConnect) {
        onConnect({
          methodId: method.id,
          type: method.type,
          name: method.name,
          provider: method.walletProvider || method.bankName || 'Card',
          isVerified: method.isVerified
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect payment method');
    } finally {
      setSelectedType(null);
    }
  };

  const getPaymentTypeName = (type: string) => {
    switch (type) {
      case 'card': return 'Credit/Debit Card';
      case 'bank': return 'Bank Account';
      case 'wallet': return 'Digital Wallet';
      case 'crypto': return 'Crypto Wallet';
      default: return 'Payment Method';
    }
  };

  const getPaymentTypeIcon = (type: string, className = "w-5 h-5") => {
    switch (type) {
      case 'card': return <CreditCard className={className} />;
      case 'bank': return <Building2 className={className} />;
      case 'wallet': return <Wallet className={className} />;
      case 'crypto': return <Bitcoin className={className} />;
      default: return <CreditCard className={className} />;
    }
  };

  if (connection.methods.length > 0 && !showMultiple) {
    const activeMethod = connection.activeMethod || connection.methods[0];
    
    return (
      <Card className="bg-success/10 border-success/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/20 rounded-lg">
              {getPaymentTypeIcon(activeMethod.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activeMethod.name}</span>
                <Badge variant="default" className="bg-success text-success-foreground">
                  <Check className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {activeMethod.last4 && `•••• ${activeMethod.last4}`}
                {activeMethod.bankName && ` - ${activeMethod.bankName}`}
                {activeMethod.walletProvider && ` - ${activeMethod.walletProvider}`}
              </p>
            </div>
            <Shield className="w-5 h-5 text-success" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const paymentOptions = [
    { type: 'card' as const, name: 'Credit/Debit Card', description: 'Visa, Mastercard, American Express' },
    { type: 'bank' as const, name: 'Bank Account', description: 'Direct bank transfer' },
    { type: 'wallet' as const, name: 'Digital Wallet', description: 'PayPal, Apple Pay, Google Pay' },
    { type: 'crypto' as const, name: 'Crypto Wallet', description: 'Bitcoin, Ethereum, and more' }
  ];

  return (
    <div className="space-y-3">
      {connection.methods.length > 0 && showMultiple && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Connected Payment Methods:</p>
          {connection.methods.map((method) => (
            <Card key={method.id} className="bg-muted/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {getPaymentTypeIcon(method.type, "w-4 h-4")}
                  <span className="font-medium">{method.name}</span>
                  {method.isDefault && (
                    <Badge variant="outline" className="text-xs">Default</Badge>
                  )}
                  <Badge variant="default" className="text-xs bg-success">
                    <Check className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        {paymentOptions.map((option) => (
          <Button
            key={option.type}
            variant={variant === 'primary' ? 'default' : 'outline'}
            className={`justify-start h-auto p-4 ${variant === 'primary' ? 'btn-gradient' : ''}`}
            onClick={() => handleConnect(option.type)}
            disabled={selectedType !== null}
          >
            <div className="flex items-center gap-3 w-full">
              {selectedType === option.type ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                getPaymentTypeIcon(option.type)
              )}
              <div className="text-left flex-1">
                <div className="font-medium">
                  {showMultiple && <Plus className="w-4 h-4 mr-1 inline" />}
                  {option.name}
                </div>
                <div className={`text-sm ${variant === 'primary' ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {option.description}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>

      {connection.error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {connection.error}
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          <Shield className="w-3 h-3 inline mr-1" />
          Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
}