import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Package, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface OrdersPageProps {
  user: any;
}

export function OrdersPage({ user }: OrdersPageProps) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: 1,
      product: 'iPhone 13 Pro 256GB',
      merchant: 'Tech Store',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      totalAmount: 999,
      paidAmount: 333,
      remainingAmount: 666,
      installments: 6,
      paidInstallments: 2,
      nextPayment: 166.5,
      dueDate: '2025-08-26',
      status: 'active',
      purchaseDate: '2025-06-15',
      payments: [
        { date: '2025-06-15', amount: 166.5, status: 'completed' },
        { date: '2025-07-15', amount: 166.5, status: 'completed' },
        { date: '2025-08-26', amount: 166.5, status: 'pending' },
        { date: '2025-09-26', amount: 166.5, status: 'scheduled' },
        { date: '2025-10-26', amount: 166.5, status: 'scheduled' },
        { date: '2025-11-26', amount: 166.5, status: 'scheduled' }
      ]
    },
    {
      id: 2,
      product: 'MacBook Pro M3 14"',
      merchant: 'Apple Store',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
      totalAmount: 2499,
      paidAmount: 833,
      remainingAmount: 1666,
      installments: 3,
      paidInstallments: 1,
      nextPayment: 833,
      dueDate: '2025-09-15',
      status: 'active',
      purchaseDate: '2025-07-15',
      payments: [
        { date: '2025-07-15', amount: 833, status: 'completed' },
        { date: '2025-09-15', amount: 833, status: 'pending' },
        { date: '2025-11-15', amount: 833, status: 'scheduled' }
      ]
    },
    {
      id: 3,
      product: 'AirPods Pro (2nd Gen)',
      merchant: 'Electronics Hub',
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
      totalAmount: 249,
      paidAmount: 166,
      remainingAmount: 83,
      installments: 3,
      paidInstallments: 2,
      nextPayment: 83,
      dueDate: '2025-08-20',
      status: 'overdue',
      purchaseDate: '2025-05-20',
      payments: [
        { date: '2025-05-20', amount: 83, status: 'completed' },
        { date: '2025-06-20', amount: 83, status: 'completed' },
        { date: '2025-08-20', amount: 83, status: 'overdue' }
      ]
    },
    {
      id: 4,
      product: 'Samsung Galaxy Watch',
      merchant: 'Gadget World',
      image: 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d4?w=400&h=400&fit=crop',
      totalAmount: 399,
      paidAmount: 399,
      remainingAmount: 0,
      installments: 6,
      paidInstallments: 6,
      nextPayment: 0,
      dueDate: null,
      status: 'completed',
      purchaseDate: '2024-12-01',
      payments: [
        { date: '2024-12-01', amount: 66.5, status: 'completed' },
        { date: '2025-01-01', amount: 66.5, status: 'completed' },
        { date: '2025-02-01', amount: 66.5, status: 'completed' },
        { date: '2025-03-01', amount: 66.5, status: 'completed' },
        { date: '2025-04-01', amount: 66.5, status: 'completed' },
        { date: '2025-05-01', amount: 66.5, status: 'completed' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'default';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const activeOrders = orders.filter(order => order.status === 'active' || order.status === 'overdue');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const overdueOrders = orders.filter(order => order.status === 'overdue');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Orders</h1>
          <p className="text-muted-foreground mt-1">
            Track your purchases and installment payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <DollarSign className="w-4 h-4 mr-2" />
            Pay All Due
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            Ongoing
            {activeOrders.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completedOrders.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {completedOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue
            {overdueOrders.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {overdueOrders.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={order.image} 
                      alt={order.product}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{order.product}</h3>
                          <p className="text-sm text-muted-foreground">{order.merchant}</p>
                        </div>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status === 'overdue' ? 'Overdue' : 'Active'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress 
                              value={(order.paidAmount / order.totalAmount) * 100} 
                              className="flex-1 h-2" 
                            />
                            <span className="text-sm">
                              {order.paidInstallments}/{order.installments}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Paid</p>
                          <p className="font-semibold">${order.paidAmount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Remaining</p>
                          <p className="font-semibold">${order.remainingAmount}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Next Payment</p>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">${order.nextPayment}</span>
                            <span className={`text-sm ${order.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}`}>
                              Due {order.dueDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={order.image} 
                      alt={order.product}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{order.product}</h3>
                          <p className="text-sm text-muted-foreground">{order.merchant}</p>
                        </div>
                        <Badge variant="secondary">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Paid</p>
                          <p className="font-semibold">${order.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Installments</p>
                          <p className="font-semibold">{order.installments} payments</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Purchase Date</p>
                          <p className="font-semibold">{order.purchaseDate}</p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          Download Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <div className="grid gap-4">
            {overdueOrders.map((order) => (
              <Card key={order.id} className="border-destructive/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={order.image} 
                      alt={order.product}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{order.product}</h3>
                          <p className="text-sm text-muted-foreground">{order.merchant}</p>
                        </div>
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Overdue
                        </Badge>
                      </div>

                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4 text-destructive" />
                          <span className="font-medium text-destructive">Payment Overdue</span>
                        </div>
                        <p className="text-sm text-destructive/80">
                          Payment of ${order.nextPayment} was due on {order.dueDate}. 
                          Late fees may apply.
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount Due</p>
                          <span className="font-semibold text-destructive">${order.nextPayment}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Contact Support
                          </Button>
                          <Button size="sm" variant="destructive">
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}