import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface TopProductsProps {
  products: Array<{
    id: number;
    name: string;
    sales: number;
    revenue: number;
    bnplUsers: number;
    avgInstallment: number;
    image: string;
  }>;
  onViewAll: () => void;
}

export function TopProducts({ products, onViewAll }: TopProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Top Products
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All
          </Button>
        </CardTitle>
        <CardDescription>Best performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <img 
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span>{product.sales} sales</span>
                  <span>${product.revenue.toLocaleString()}</span>
                  <Badge variant="secondary" className="text-xs">
                    {product.bnplUsers} BNPL users
                  </Badge>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="font-medium">{product.avgInstallment} mo avg</div>
                <div className="text-muted-foreground">installments</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}