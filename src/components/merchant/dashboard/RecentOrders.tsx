import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface RecentOrdersProps {
  orders: Array<{
    id: string;
    customer: string;
    product: string;
    amount: number;
    installment: string;
    status: string;
    date: string;
  }>;
  onViewAll: () => void;
}

export function RecentOrders({ orders, onViewAll }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Orders
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All
          </Button>
        </CardTitle>
        <CardDescription>Latest BNPL transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium">{order.customer}</h4>
                <p className="text-sm text-muted-foreground">{order.product}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">${order.amount}</div>
                <div className="text-sm text-muted-foreground">{order.installment}</div>
                <Badge variant={getStatusColor(order.status)} className="text-xs mt-1">
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}