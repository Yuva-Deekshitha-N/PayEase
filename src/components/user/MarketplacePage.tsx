import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart,
  CreditCard,
  Calendar,
  Percent
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { PaymentConnect } from '../auth/PaymentConnect';
import { toast } from 'sonner';

interface MarketplacePageProps {
  user: any;
}

export function MarketplacePage({ user }: MarketplacePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      price: 1199,
      rating: 4.8,
      reviews: 2847,
      image: 'https://images.unsplash.com/photo-1705037282052-f6b776980f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjAxNSUyMHBybyUyMHNtYXJ0cGhvbmV8ZW58MXx8fHwxNzU2MDMyNDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Electronics',
      merchant: 'Tech Store',
      bnplPlans: [
        { months: 3, monthlyPayment: 399.67, interest: 0, popular: false },
        { months: 6, monthlyPayment: 199.83, interest: 2.9, popular: true },
        { months: 12, monthlyPayment: 104.92, interest: 4.9, popular: false }
      ]
    },
    {
      id: 2,
      name: 'MacBook Pro M3 16"',
      brand: 'Apple',
      price: 2999,
      rating: 4.9,
      reviews: 1543,
      image: 'https://images.unsplash.com/photo-1629491697442-7d67fc25d897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwcHJvJTIwbGFwdG9wJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzU1OTc1MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Electronics',
      merchant: 'Apple Store',
      bnplPlans: [
        { months: 3, monthlyPayment: 999.67, interest: 0, popular: false },
        { months: 6, monthlyPayment: 516.50, interest: 3.9, popular: true },
        { months: 12, monthlyPayment: 274.92, interest: 5.9, popular: false }
      ]
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      price: 1299,
      rating: 4.7,
      reviews: 3241,
      image: 'https://images.unsplash.com/photo-1706989239873-ec28064b952e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwZ2FsYXh5JTIwczI0JTIwc21hcnRwaG9uZXxlbnwxfHx8fDE3NTYwMzI1MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Electronics',
      merchant: 'Samsung Store',
      bnplPlans: [
        { months: 3, monthlyPayment: 433, interest: 0, popular: false },
        { months: 6, monthlyPayment: 224.83, interest: 2.9, popular: true },
        { months: 12, monthlyPayment: 117.42, interest: 4.9, popular: false }
      ]
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      price: 399,
      rating: 4.6,
      reviews: 1876,
      image: 'https://images.unsplash.com/photo-1609255386725-b9b6a8ad829c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb255JTIwaGVhZHBob25lcyUyMHdpcmVsZXNzfGVufDF8fHx8MTc1NjAzMjUxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Audio',
      merchant: 'Audio Pro',
      bnplPlans: [
        { months: 3, monthlyPayment: 133, interest: 0, popular: true },
        { months: 6, monthlyPayment: 68.83, interest: 2.9, popular: false }
      ]
    },
    {
      id: 5,
      name: 'Nintendo Switch OLED',
      brand: 'Nintendo',
      price: 349,
      rating: 4.5,
      reviews: 2156,
      image: 'https://images.unsplash.com/photo-1585857188892-93512a3a0efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaW50ZW5kbyUyMHN3aXRjaCUyMGdhbWluZyUyMGNvbnNvbGV8ZW58MXx8fHwxNzU1OTc1MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Gaming',
      merchant: 'GameZone',
      bnplPlans: [
        { months: 3, monthlyPayment: 116.33, interest: 0, popular: true },
        { months: 6, monthlyPayment: 60.17, interest: 2.9, popular: false }
      ]
    },
    {
      id: 6,
      name: 'Apple Watch Series 9',
      brand: 'Apple',
      price: 429,
      rating: 4.8,
      reviews: 1234,
      image: 'https://images.unsplash.com/photo-1598516802414-50a01bee818d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHdhdGNoJTIwc21hcnR3YXRjaHxlbnwxfHx8fDE3NTYwMzI1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Wearables',
      merchant: 'Tech Store',
      bnplPlans: [
        { months: 3, monthlyPayment: 143, interest: 0, popular: true },
        { months: 6, monthlyPayment: 74.17, interest: 2.9, popular: false }
      ]
    }
  ];

  const categories = ['all', 'Electronics', 'Audio', 'Gaming', 'Wearables'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBuyNow = (product: any, plan: any) => {
    if (!user.hasPaymentMethod) {
      toast.error('Please connect a payment method to proceed');
      return;
    }

    // Mock BNPL purchase process
    toast.success(`Payment plan created! You'll pay $${plan.monthlyPayment}/month for ${plan.months} months.`);
    setSelectedProduct(null);
    setSelectedPlan(null);
  };

  const handlePaymentConnect = (paymentData: any) => {
    // Update user payment information
    console.log('Payment method connected in marketplace:', paymentData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>PayEase Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Shop now, pay later with flexible installment plans
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="card-hover">
            <div className="aspect-square overflow-hidden rounded-t-lg bg-muted/20">
              <ImageWithFallback 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.brand}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${product.price}</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">From {product.merchant}</span>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium">Payment Options:</p>
                {product.bnplPlans.slice(0, 2).map((plan, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{plan.months} months</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${plan.monthlyPayment}/mo</span>
                      {plan.interest === 0 ? (
                        <Badge variant="secondary" className="text-xs">0% APR</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">{plan.interest}% APR</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full btn-gradient" onClick={() => setSelectedProduct(product)}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy on Installments
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Choose Payment Plan</DialogTitle>
                    <DialogDescription>
                      Select your preferred installment plan for {product.name}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <ImageWithFallback 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">${product.price}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {product.bnplPlans.map((plan, index) => (
                        <div 
                          key={index}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedPlan === index ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedPlan(index)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{plan.months} Months</span>
                              {plan.popular && (
                                <Badge variant="default" className="text-xs">Popular</Badge>
                              )}
                            </div>
                            <span className="font-bold">${plan.monthlyPayment}/mo</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Total: ${(plan.monthlyPayment * plan.months).toFixed(2)}</span>
                            <span>{plan.interest === 0 ? '0% APR' : `${plan.interest}% APR`}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!user.hasPaymentMethod && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">Connect a payment method to proceed</p>
                        <PaymentConnect onConnect={handlePaymentConnect} variant="secondary" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedProduct(null);
                          setSelectedPlan(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 btn-gradient"
                        disabled={selectedPlan === null || !user.hasPaymentMethod}
                        onClick={() => handleBuyNow(product, product.bnplPlans[selectedPlan])}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}