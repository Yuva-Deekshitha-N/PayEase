import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '../ui/dropdown-menu';
import { Bell, CreditCard, PiggyBank, AlertTriangle, CheckCircle } from 'lucide-react';

export function NotificationDropdown() {
  const notifications = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment Due Tomorrow',
      message: 'iPhone 13 Pro - $83.33 due on Aug 25',
      time: '2 hours ago',
      unread: true,
      icon: CreditCard
    },
    {
      id: 2,
      type: 'piggy-bank',
      title: 'Auto-Save Milestone',
      message: 'You\'ve saved $250 this month! 🎉',
      time: '5 hours ago',
      unread: true,
      icon: PiggyBank
    },
    {
      id: 3,
      type: 'success',
      title: 'Payment Completed',
      message: 'MacBook Pro installment paid successfully',
      time: '1 day ago',
      unread: false,
      icon: CheckCircle
    },
    {
      id: 4,
      type: 'warning',
      title: 'Late Payment Warning',
      message: 'AirPods payment is 2 days overdue',
      time: '2 days ago',
      unread: false,
      icon: AlertTriangle
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3">
            <div className={`p-1 rounded-full ${
              notification.type === 'payment' ? 'bg-blue-100 text-blue-600' :
              notification.type === 'piggy-bank' ? 'bg-green-100 text-green-600' :
              notification.type === 'success' ? 'bg-green-100 text-green-600' :
              'bg-yellow-100 text-yellow-600'
            }`}>
              <notification.icon className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-sm truncate">{notification.title}</p>
                {notification.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-sm text-muted-foreground justify-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}