import React from 'react';
import { Button } from '../ui/button';
import { Package, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SummaryCards } from './dashboard/SummaryCards';
import { RevenueChart } from './dashboard/RevenueChart';
import { PaymentStatusChart } from './dashboard/PaymentStatusChart';
import { TopProducts } from './dashboard/TopProducts';
import { RecentOrders } from './dashboard/RecentOrders';
import { 
  summaryStats, 
  revenueData, 
  paymentStatusData, 
  topProducts, 
  recentOrders 
} from './data/dashboardData';

interface MerchantDashboardProps {
  user: any;
}

export function MerchantDashboard({ user }: MerchantDashboardProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's your business overview for today
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/products')}>
            <Package className="w-4 h-4 mr-2" />
            Manage Products
          </Button>
          <Button onClick={() => navigate('/analytics')}>
            <TrendingUp className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      <SummaryCards stats={summaryStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <PaymentStatusChart data={paymentStatusData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts 
          products={topProducts} 
          onViewAll={() => navigate('/products')} 
        />
        <RecentOrders 
          orders={recentOrders} 
          onViewAll={() => navigate('/users')} 
        />
      </div>
    </div>
  );
}