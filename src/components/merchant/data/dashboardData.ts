export const summaryStats = [
  {
    title: 'Total Revenue',
    value: '$156,430',
    description: '+12.5% from last month',
    icon: 'DollarSign',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    trend: 'up'
  },
  {
    title: 'Active Users',
    value: '1,247',
    description: '+89 new this month',
    icon: 'Users',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: 'up'
  },
  {
    title: 'Default Rate',
    value: '2.3%',
    description: '-0.5% from last month',
    icon: 'AlertTriangle',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    trend: 'down'
  },
  {
    title: 'Pending Payments',
    value: '$23,890',
    description: '124 installments due',
    icon: 'Calendar',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    trend: 'neutral'
  }
];

export const revenueData = [
  { month: 'Jan', revenue: 12400, orders: 45 },
  { month: 'Feb', revenue: 13200, orders: 52 },
  { month: 'Mar', revenue: 15600, orders: 61 },
  { month: 'Apr', revenue: 14800, orders: 58 },
  { month: 'May', revenue: 16900, orders: 67 },
  { month: 'Jun', revenue: 18200, orders: 72 },
  { month: 'Jul', revenue: 19500, orders: 78 },
  { month: 'Aug', revenue: 21300, orders: 84 }
];

export const paymentStatusData = [
  { name: 'On Time', value: 78.5, count: 982, color: '#22c55e' },
  { name: 'Late (1-7 days)', value: 16.2, count: 203, color: '#eab308' },
  { name: 'Late (7+ days)', value: 3.8, count: 48, color: '#f97316' },
  { name: 'Defaulted', value: 1.5, count: 19, color: '#ef4444' }
];

export const topProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    sales: 234,
    revenue: 279780,
    bnplUsers: 189,
    avgInstallment: 6,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    name: 'MacBook Pro M3',
    sales: 156,
    revenue: 467640,
    bnplUsers: 142,
    avgInstallment: 8,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    name: 'Samsung Galaxy S24',
    sales: 189,
    revenue: 245370,
    bnplUsers: 167,
    avgInstallment: 5,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop'
  },
  {
    id: 4,
    name: 'AirPods Pro 2',
    sales: 312,
    revenue: 77688,
    bnplUsers: 278,
    avgInstallment: 3,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop'
  }
];

export const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    product: 'iPhone 15 Pro',
    amount: 1199,
    installment: '1/6',
    status: 'active',
    date: '2025-08-24'
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Chen',
    product: 'MacBook Pro',
    amount: 2499,
    installment: '2/3',
    status: 'active',
    date: '2025-08-23'
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    product: 'AirPods Pro',
    amount: 249,
    installment: '3/3',
    status: 'overdue',
    date: '2025-08-20'
  }
];