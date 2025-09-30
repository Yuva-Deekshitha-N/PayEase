import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  User,
  Clock,
  DollarSign
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface RiskDashboardProps {
  user: any;
}

export function RiskDashboard({ user }: RiskDashboardProps) {
  const riskDistribution = [
    { name: 'Low Risk', value: 72.5, count: 905, color: '#22c55e' },
    { name: 'Medium Risk', value: 21.8, count: 272, color: '#eab308' },
    { name: 'High Risk', value: 5.7, count: 71, color: '#ef4444' }
  ];

  const riskFactors = [
    { factor: 'Credit Score', weight: 35, impact: 'high' },
    { factor: 'Payment History', weight: 30, impact: 'high' },
    { factor: 'Location', weight: 15, impact: 'medium' },
    { factor: 'Order Value', weight: 10, impact: 'medium' },
    { factor: 'Account Age', weight: 10, impact: 'low' }
  ];

  const defaultTrends = [
    { month: 'Mar', defaults: 4.2, amount: 12400 },
    { month: 'Apr', defaults: 3.8, amount: 11200 },
    { month: 'May', defaults: 2.9, amount: 8900 },
    { month: 'Jun', defaults: 3.1, amount: 9800 },
    { month: 'Jul', defaults: 3.7, amount: 11600 },
    { month: 'Aug', defaults: 2.3, amount: 7200 }
  ];

  const highRiskUsers = [
    {
      id: 1,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      creditScore: 650,
      riskScore: 85,
      outstandingAmount: 166,
      daysOverdue: 4,
      location: 'Chicago, IL',
      riskFactors: ['Low Credit Score', 'Late Payments', 'High Order Value']
    },
    {
      id: 2,
      name: 'Jessica Torres',
      email: 'jessica@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica',
      creditScore: 620,
      riskScore: 78,
      outstandingAmount: 450,
      daysOverdue: 1,
      location: 'Detroit, MI',
      riskFactors: ['Low Credit Score', 'New Account', 'High Risk Location']
    },
    {
      id: 3,
      name: 'David Wilson',
      email: 'david@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
      creditScore: 680,
      riskScore: 72,
      outstandingAmount: 833,
      daysOverdue: 0,
      location: 'Cleveland, OH',
      riskFactors: ['Payment Pattern Changes', 'High Order Value']
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 dark:text-red-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Risk Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor user risk levels and default patterns
          </p>
        </div>
        <Button variant="outline">
          <MapPin className="w-4 h-4 mr-2" />
          Geographic Risk Map
        </Button>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">Good</div>
            <p className="text-xs text-muted-foreground">
              72.5% of users are low risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3%</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              -1.4% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Amount</CardTitle>
            <DollarSign className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$23,890</div>
            <p className="text-xs text-muted-foreground">
              From 71 high-risk users
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>User distribution by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {riskDistribution.map((risk, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: risk.color }}
                    />
                    <span className="text-sm">{risk.name}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {risk.count} users ({risk.value}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Default Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Default Trends</CardTitle>
            <CardDescription>Monthly default rates and amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defaultTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'defaults' ? `${value}%` : `$${value.toLocaleString()}`,
                      name === 'defaults' ? 'Default Rate' : 'Default Amount'
                    ]}
                  />
                  <Bar dataKey="defaults" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Factors</CardTitle>
          <CardDescription>Weighted factors used in risk calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{factor.factor}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium capitalize ${getImpactColor(factor.impact)}`}>
                        {factor.impact} impact
                      </span>
                      <span className="text-sm text-muted-foreground">{factor.weight}%</span>
                    </div>
                  </div>
                  <Progress value={factor.weight} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High Risk Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            High Risk Users
          </CardTitle>
          <CardDescription>Users requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highRiskUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-foreground">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Credit: {user.creditScore}</span>
                      <span>Location: {user.location}</span>
                      {user.daysOverdue > 0 && (
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {user.daysOverdue} days overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    Risk: {user.riskScore}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Outstanding: ${user.outstandingAmount}
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Contact
                    </Button>
                    <Button size="sm" variant="destructive" className="text-xs h-7">
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}