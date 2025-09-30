import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Search, 
  Filter, 
  MapPin, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  Shield,
  Eye,
  Navigation,
  History
} from 'lucide-react';
import { locationService } from '../shared/LocationService';
import { toast } from 'sonner';

interface UserTrackingProps {
  user: any;
}

export function UserTracking({ user }: UserTrackingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      product: 'iPhone 15 Pro',
      totalAmount: 1199,
      paidAmount: 399.67,
      installmentsPaid: 2,
      totalInstallments: 6,
      nextPayment: 199.83,
      dueDate: '2025-08-26',
      status: 'active',
      riskLevel: 'low',
      creditScore: 750,
      location: 'New York, NY',
      lastPayment: '2025-07-26',
      joinDate: '2025-06-15',
      locationConsent: true,
      lastLocationUpdate: '2025-09-30T10:30:00Z'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      product: 'MacBook Pro M3',
      totalAmount: 2499,
      paidAmount: 833,
      installmentsPaid: 1,
      totalInstallments: 3,
      nextPayment: 833,
      dueDate: '2025-09-15',
      status: 'active',
      riskLevel: 'low',
      creditScore: 820,
      location: 'San Francisco, CA',
      lastPayment: '2025-07-15',
      joinDate: '2025-07-15',
      locationConsent: true,
      lastLocationUpdate: '2025-09-30T09:15:00Z'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      product: 'AirPods Pro',
      totalAmount: 249,
      paidAmount: 166,
      installmentsPaid: 2,
      totalInstallments: 3,
      nextPayment: 83,
      dueDate: '2025-08-20',
      status: 'overdue',
      riskLevel: 'high',
      creditScore: 650,
      location: 'Chicago, IL',
      lastPayment: '2025-06-20',
      joinDate: '2025-05-20',
      locationConsent: false,
      lastLocationUpdate: null
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      product: 'Samsung Galaxy Watch',
      totalAmount: 399,
      paidAmount: 399,
      installmentsPaid: 6,
      totalInstallments: 6,
      nextPayment: 0,
      dueDate: null,
      status: 'completed',
      riskLevel: 'low',
      creditScore: 780,
      location: 'Austin, TX',
      lastPayment: '2025-05-01',
      joinDate: '2024-12-01',
      locationConsent: true,
      lastLocationUpdate: '2025-09-29T16:45:00Z'
    },
    {
      id: 5,
      name: 'Alex Kumar',
      email: 'alex@example.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      product: 'Nintendo Switch',
      totalAmount: 349,
      paidAmount: 232.67,
      installmentsPaid: 2,
      totalInstallments: 3,
      nextPayment: 116.33,
      dueDate: '2025-08-28',
      status: 'active',
      riskLevel: 'medium',
      creditScore: 720,
      location: 'Seattle, WA',
      lastPayment: '2025-07-28',
      joinDate: '2025-06-28',
      locationConsent: true,
      lastLocationUpdate: '2025-09-30T11:20:00Z'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || user.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'default';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleRequestLocation = async (userId: string) => {
    try {
      const granted = await locationService.requestLocationPermission(
        userId,
        user.id, // merchant ID
        'payment_recovery'
      );
      
      if (granted) {
        toast.success('Location permission granted by user');
        // Update UI to reflect new permission
      } else {
        toast.error('Location permission denied by user');
      }
    } catch (error) {
      toast.error('Failed to request location permission');
    }
  };

  const getUserLocationStatus = (user: any) => {
    if (!user.locationConsent) {
      return { status: 'denied', color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> };
    }
    if (user.lastLocationUpdate) {
      const lastUpdate = new Date(user.lastLocationUpdate);
      const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceUpdate < 1) {
        return { status: 'active', color: 'text-green-600', icon: <Navigation className="w-4 h-4" /> };
      } else if (hoursSinceUpdate < 24) {
        return { status: 'recent', color: 'text-yellow-600', icon: <Clock className="w-4 h-4" /> };
      }
    }
    return { status: 'stale', color: 'text-gray-600', icon: <MapPin className="w-4 h-4" /> };
  };

  const formatLocationUpdate = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${Math.floor(diffHours)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>User Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your BNPL customers, payment status, and locations for security
          </p>
        </div>
        <Button variant="outline">
          <MapPin className="w-4 h-4 mr-2" />
          View Map
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Location Tracking for Security</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Customer locations are visible for security purposes, especially for overdue payments to assist with recovery processes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users, emails, or products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className={`${user.status === 'overdue' ? 'border-destructive/20' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* User Info */}
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {user.name}
                      <Badge variant={getStatusColor(user.status)} className="text-xs">
                        {getStatusIcon(user.status)}
                        {user.status}
                      </Badge>
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        {getUserLocationStatus(user).icon}
                        <span className={getUserLocationStatus(user).color}>
                          {user.location}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last update: {formatLocationUpdate(user.lastLocationUpdate)}
                      </div>
                    </div>
                  </div>

                  {/* Product & Payment Info */}
                  <div>
                    <h4 className="font-medium">{user.product}</h4>
                    <p className="text-sm text-muted-foreground">Total: ${user.totalAmount}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{user.installmentsPaid}/{user.totalInstallments}</span>
                      </div>
                      <Progress 
                        value={(user.paidAmount / user.totalAmount) * 100} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Paid: ${user.paidAmount} of ${user.totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* Risk & Credit */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Risk Level:</span>
                      <span className={`text-sm font-medium capitalize ${getRiskColor(user.riskLevel)}`}>
                        {user.riskLevel}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Credit Score: {user.creditScore}</div>
                      <div>Joined: {user.joinDate}</div>
                      <div>Last Payment: {user.lastPayment}</div>
                    </div>
                  </div>

                  {/* Next Payment */}
                  <div className="text-right">
                    {user.status === 'completed' ? (
                      <div>
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-green-600">Completed</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-lg font-semibold">${user.nextPayment}</div>
                        <div className="text-sm text-muted-foreground">Next Payment</div>
                        <div className={`text-sm mt-1 ${user.status === 'overdue' ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                          {user.status === 'overdue' ? 'Overdue' : `Due ${user.dueDate}`}
                        </div>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            Contact
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="text-xs h-7"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>User Details & Location</DialogTitle>
                                <DialogDescription>
                                  {user.name} - Payment & Location Information
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                {/* Location Status */}
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium">Location Status</h4>
                                      <Badge 
                                        variant={user.locationConsent ? "default" : "destructive"}
                                        className="text-xs"
                                      >
                                        {user.locationConsent ? "Enabled" : "Disabled"}
                                      </Badge>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        {getUserLocationStatus(user).icon}
                                        <span>Current: {user.location}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>Updated: {formatLocationUpdate(user.lastLocationUpdate)}</span>
                                      </div>
                                    </div>

                                    {!user.locationConsent && user.status === 'overdue' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full mt-3"
                                        onClick={() => handleRequestLocation(user.id)}
                                      >
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Request Location Access
                                      </Button>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Payment Info */}
                                <Card>
                                  <CardContent className="p-4">
                                    <h4 className="font-medium mb-2">Payment Status</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Total Amount:</span>
                                        <span>${user.totalAmount}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Paid:</span>
                                        <span>${user.paidAmount}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Next Payment:</span>
                                        <span className={user.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                                          ${user.nextPayment}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Due Date:</span>
                                        <span className={user.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                                          {user.dueDate || 'Completed'}
                                        </span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {user.locationConsent && user.status === 'overdue' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-7"
                              onClick={() => toast.info('Location tracking active for payment recovery')}
                            >
                              <MapPin className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}