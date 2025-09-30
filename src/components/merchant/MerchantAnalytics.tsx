import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  Calendar,
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface MerchantAnalyticsProps {
  user: any;
}

export function MerchantAnalytics({ user }: MerchantAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('6m');

  const revenueData = [
    { month: 'Mar', revenue: 15600, bnpl: 11200, cash: 4400 },
    { month: 'Apr', revenue: 14800, bnpl: 10360, cash: 4440 },
    { month: 'May', revenue: 16900, bnpl: 12430, cash: 4470 },
    { month: 'Jun', revenue: 18200, bnpl: 13650, cash: 4550 },
    { month: 'Jul', revenue: 19500, bnpl: 14625, cash: 4875 },
    { month: 'Aug', revenue: 21300, bnpl: 16620, cash: 4680 }
  ];

  const userGrowthData = [
    { month: 'Mar', total: 892, new: 67, bnpl: 645 },
    { month: 'Apr', total: 956, new: 64, bnpl: 698 },
    { month: 'May', total: 1034, new: 78, bnpl: 756 },
    { month: 'Jun', total: 1123, new: 89, bnpl: 823 },
    { month: 'Jul', total: 1198, new: 75, bnpl: 887 },
    { month: 'Aug', total: 1287, new: 89, bnpl: 967 }
  ];

  const productPerformanceData = [
    { product: 'iPhone 15 Pro', sales: 234, revenue: 279780, bnplRate: 81 },
    { product: 'MacBook Pro M3', sales: 156, revenue: 467640, bnplRate: 91 },
    { product: 'AirPods Pro', sales: 312, revenue: 77688, bnplRate: 89 },
    { product: 'Samsung Galaxy', sales: 189, revenue: 245370, bnplRate: 88 },
    { product: 'iPad Air', sales: 145, revenue: 87000, bnplRate: 75 }
  ];

  const paymentTrendsData = [
    { month: 'Mar', onTime: 78.2, late: 18.5, defaulted: 3.3 },
    { month: 'Apr', onTime: 79.1, late: 17.8, defaulted: 3.1 },
    { month: 'May', onTime: 80.5, late: 16.9, defaulted: 2.6 },
    { month: 'Jun', onTime: 81.2, late: 16.1, defaulted: 2.7 },
    { month: 'Jul', onTime: 79.8, late: 17.3, defaulted: 2.9 },
    { month: 'Aug', onTime: 78.5, late: 19.2, defaulted: 2.3 }
  ];

  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: '$156,430',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'BNPL Users',
      value: '967',
      change: '+8.9%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Avg Order Value',
      value: '$523',
      change: '+4.2%',
      trend: 'up',
      icon: Package,
      color: 'text-purple-600'
    },
    {
      title: 'Default Rate',
      value: '2.3%',
      change: '-0.6%',
      trend: 'down',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">
            Detailed insights into your BNPL business performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <p className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} from last month
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>BNPL vs Cash payments over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Area type="monotone" dataKey="bnpl" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                      <Area type="monotone" dataKey="cash" stackId="1" stroke="#10b981" fill="#10b981" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Growth</CardTitle>
                <CardDescription>Month-over-month revenue comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">This Month (Aug)</h4>
                      <p className="text-2xl font-bold text-green-700">$21,300</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">+9.2%</span>
                      </div>
                      <p className="text-sm text-green-600">vs last month</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>BNPL Revenue</span>
                      <span className="font-medium">$16,620 (78%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cash Revenue</span>
                      <span className="font-medium">$4,680 (22%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average Order Value</span>
                      <span className="font-medium">$523</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Total users and BNPL adoption over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Users" />
                    <Line type="monotone" dataKey="bnpl" stroke="#82ca9d" name="BNPL Users" />
                    <Line type="monotone" dataKey="new" stroke="#ffc658" name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Top products by sales and BNPL adoption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformanceData.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.product}</h4>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${product.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{product.bnplRate}% BNPL rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Performance</CardTitle>
              <CardDescription>On-time payment rates and defaults over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={paymentTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                    <Line type="monotone" dataKey="onTime" stroke="#22c55e" name="On Time %" />
                    <Line type="monotone" dataKey="late" stroke="#eab308" name="Late %" />
                    <Line type="monotone" dataKey="defaulted" stroke="#ef4444" name="Defaulted %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}