import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Bell, 
  CreditCard, 
  PiggyBank, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  ShoppingBag,
  Calendar,
  Mail
} from 'lucide-react';

interface NotificationsPageProps {
  user: any;
}

export function NotificationsPage({ user }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'payment',
      title: 'Payment Due Tomorrow',
      message: 'Your iPhone 13 Pro installment of $83.33 is due tomorrow (Aug 25, 2025).',
      time: '2 hours ago',
      date: '2025-08-24',
      unread: true,
      priority: 'high',
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 2,
      type: 'piggy-bank',
      title: 'Auto-Save Milestone Reached! 🎉',
      message: 'Congratulations! You\'ve successfully saved $250 this month through auto-save.',
      time: '5 hours ago',
      date: '2025-08-24',
      unread: true,
      priority: 'medium',
      icon: PiggyBank,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'success',
      title: 'Payment Completed Successfully',
      message: 'Your MacBook Pro installment payment of $833.00 has been processed successfully.',
      time: '1 day ago',
      date: '2025-08-23',
      unread: false,
      priority: 'low',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Late Payment Warning',
      message: 'Your AirPods Pro payment of $83.00 is now 2 days overdue. Please pay immediately to avoid additional fees.',
      time: '2 days ago',
      date: '2025-08-22',
      unread: false,
      priority: 'high',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 5,
      type: 'credit',
      title: 'Credit Score Improved',
      message: 'Great news! Your credit score has increased by 12 points to 750 due to consistent on-time payments.',
      time: '3 days ago',
      date: '2025-08-21',
      unread: false,
      priority: 'medium',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 6,
      type: 'piggy-bank',
      title: 'Auto-Conversion Activated',
      message: 'Your piggy bank balance of $150 has been automatically used to prepay your next iPhone installment.',
      time: '1 week ago',
      date: '2025-08-17',
      unread: false,
      priority: 'medium',
      icon: PiggyBank,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 7,
      type: 'marketplace',
      title: 'New BNPL Offer Available',
      message: 'Check out the new Samsung Galaxy S24 Ultra with 0% APR for 6 months on our marketplace.',
      time: '1 week ago',
      date: '2025-08-17',
      unread: false,
      priority: 'low',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 8,
      type: 'payment',
      title: 'Payment Reminder',
      message: 'Don\'t forget! Your MacBook Pro payment of $833.00 is due in 3 days (Sep 15, 2025).',
      time: '1 week ago',
      date: '2025-08-17',
      unread: false,
      priority: 'medium',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => n.unread).length;
  const allNotifications = notifications;
  const unreadNotifications = notifications.filter(n => n.unread);
  const paymentNotifications = notifications.filter(n => n.type === 'payment' || n.type === 'warning');
  const piggyBankNotifications = notifications.filter(n => n.type === 'piggy-bank');

  const NotificationCard = ({ notification }: { notification: any }) => (
    <Card className={`${notification.unread ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${notification.bgColor}`}>
            <notification.icon className={`w-5 h-5 ${notification.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{notification.title}</h3>
                {notification.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
                <Badge 
                  variant={
                    notification.priority === 'high' ? 'destructive' : 
                    notification.priority === 'medium' ? 'default' : 'secondary'
                  } 
                  className="text-xs"
                >
                  {notification.priority}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {notification.time}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {notification.message}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {notification.date}
              </span>
              <div className="flex gap-2">
                {notification.unread && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="text-xs h-7"
                  >
                    Mark as read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteNotification(notification.id)}
                  className="text-xs h-7 text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="default" className="text-sm">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Stay updated with payments, savings, and account activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Mail className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            {allNotifications.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {allNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            Unread
            {unreadCount > 0 && (
              <Badge variant="default" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            Payments
            {paymentNotifications.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {paymentNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="piggy-bank" className="flex items-center gap-2">
            Piggy Bank
            {piggyBankNotifications.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {piggyBankNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allNotifications.length > 0 ? (
            <div className="space-y-4">
              {allNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length > 0 ? (
            <div className="space-y-4">
              {unreadNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No unread notifications</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {paymentNotifications.length > 0 ? (
            <div className="space-y-4">
              {paymentNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No payment notifications</h3>
              <p className="text-muted-foreground">All your payments are up to date!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="piggy-bank" className="space-y-4">
          {piggyBankNotifications.length > 0 ? (
            <div className="space-y-4">
              {piggyBankNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <PiggyBank className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No piggy bank notifications</h3>
              <p className="text-muted-foreground">Your savings activity will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}