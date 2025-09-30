import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  DollarSign, 
  Users, 
  AlertTriangle, 
  Calendar,
  TrendingUp, 
  TrendingDown
} from 'lucide-react';

const iconMap = {
  DollarSign,
  Users,
  AlertTriangle,
  Calendar
};

interface SummaryCardsProps {
  stats: Array<{
    title: string;
    value: string;
    description: string;
    icon: string;
    color: string;
    bgColor: string;
    trend: string;
  }>;
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
                {stat.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-600" />}
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}