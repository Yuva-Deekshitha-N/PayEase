import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  PiggyBank, 
  Calendar, 
  TrendingUp, 
  ShoppingCart,
  DollarSign,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserDashboardProps {
  user: any;
}

export function UserDashboard({ user }: UserDashboardProps) {
  const navigate = useNavigate();

  const summaryStats = [
    {
      title: 'Active Installments',
      value: '3',
      description: '$412.50 total remaining',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Piggy Bank Balance',
      value: '$287.45',
      description: '+$45.20 this month',
      icon: PiggyBank,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Next Payment',
      value: '$83.33',
      description: 'Due in 2 days',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Credit Score',
      value: user.creditScore || '750',
      description: '+12 points this month',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const activeOrders = [
    {
      id: 1,
      product: 'iPhone 13 Pro',
      merchant: 'Tech Store',
      totalAmount: 999,
      paidAmount: 333,
      installments: '2/6',
      nextPayment: 83.33,
      dueDate: '2025-08-26',
      status: 'active'
    },
    {
      id: 2,
      product: 'MacBook Pro M3',
      merchant: 'Apple Store',
      totalAmount: 2499,
      paidAmount: 833,
      installments: '1/3',
      nextPayment: 833,
      dueDate: '2025-09-15',
      status: 'active'
    },
    {
      id: 3,
      product: 'AirPods Pro',
      merchant: 'Electronics Hub',
      totalAmount: 249,
      paidAmount: 166,
      installments: '2/3',
      nextPayment: 83,
      dueDate: '2025-08-20',
      status: 'overdue'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's your BNPL overview for today
          </p>
        </div>
        <Button onClick={() => navigate('/marketplace')}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Browse Marketplace
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Orders
              <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
                View All
              </Button>
            </CardTitle>
            <CardDescription>Your current installment plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div key={order.id} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{order.product}</h3>
                      <Badge 
                        variant={order.status === 'overdue' ? 'destructive' : 'default'}
                        className="text-xs"
                      >
                        {order.status === 'overdue' ? 'Overdue' : 'Active'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{order.merchant}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Progress 
                        value={(order.paidAmount / order.totalAmount) * 100} 
                        className="flex-1 h-2" 
                      />
                      <span className="text-xs text-muted-foreground">
                        {order.installments}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Next: ${order.nextPayment}
                      </span>
                      <span className={order.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}>
                        Due {order.dueDate}
                      </span>
                    </div>
                  </div>
                  {order.status === 'overdue' && (
                    <AlertCircle className="w-4 h-4 text-destructive ml-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Piggy Bank Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Piggy Bank Activity
              <Button variant="outline" size="sm" onClick={() => navigate('/piggy-bank')}>
                Manage
              </Button>
            </CardTitle>
            <CardDescription>Your savings and auto-conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <PiggyBank className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">$287.45</div>
                <p className="text-sm text-green-600">Current Balance</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Auto-save enabled</span>
                  <Badge variant="secondary">$25/week</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Auto-conversion</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>This month's savings</span>
                  <span className="text-green-600">+$45.20</span>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                Add Money
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/orders')}>
              <Clock className="w-5 h-5 mb-2" />
              Pay Early
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/marketplace')}>
              <ShoppingCart className="w-5 h-5 mb-2" />
              New Purchase
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/piggy-bank')}>
              <PiggyBank className="w-5 h-5 mb-2" />
              Save Money
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/profile')}>
              <TrendingUp className="w-5 h-5 mb-2" />
              Credit Score
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}