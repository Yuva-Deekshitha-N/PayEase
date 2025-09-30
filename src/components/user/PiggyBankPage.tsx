import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Target,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PiggyBankPageProps {
  user: any;
}

export function PiggyBankPage({ user }: PiggyBankPageProps) {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [autoConvertEnabled, setAutoConvertEnabled] = useState(true);
  const [weeklyAmount, setWeeklyAmount] = useState(25);
  const [savingsGoal, setSavingsGoal] = useState(500);
  const [addAmount, setAddAmount] = useState('');

  const currentBalance = 287.45;
  const monthlyGrowth = 45.20;
  const totalSaved = 1243.67;
  const autoConverted = 156.22;

  const savingsHistory = [
    { month: 'Jan', saved: 78, converted: 45 },
    { month: 'Feb', saved: 92, converted: 38 },
    { month: 'Mar', saved: 156, converted: 67 },
    { month: 'Apr', saved: 134, converted: 89 },
    { month: 'May', saved: 189, converted: 123 },
    { month: 'Jun', saved: 223, converted: 145 },
    { month: 'Jul', saved: 267, converted: 156 },
    { month: 'Aug', saved: 287, converted: 156 }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'deposit',
      description: 'Weekly auto-save',
      amount: 25,
      date: '2025-08-20',
      balance: 287.45
    },
    {
      id: 2,
      type: 'conversion',
      description: 'Auto-converted to iPhone payment',
      amount: -50,
      date: '2025-08-18',
      balance: 262.45
    },
    {
      id: 3,
      type: 'deposit',
      description: 'Manual deposit',
      amount: 100,
      date: '2025-08-15',
      balance: 312.45
    },
    {
      id: 4,
      type: 'deposit',
      description: 'Weekly auto-save',
      amount: 25,
      date: '2025-08-13',
      balance: 212.45
    },
    {
      id: 5,
      type: 'conversion',
      description: 'Auto-converted to MacBook payment',
      amount: -75,
      date: '2025-08-10',
      balance: 187.45
    }
  ];

  const handleAddMoney = () => {
    if (!addAmount || parseFloat(addAmount) <= 0) return;
    // Mock add money functionality
    console.log(`Adding $${addAmount} to piggy bank`);
    setAddAmount('');
  };

  const goalProgress = (currentBalance / savingsGoal) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Savings Bank</h1>
          <p className="text-muted-foreground mt-1">
            Save money and automatically pay your installments
          </p>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-green-600" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                ${currentBalance.toFixed(2)}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-green-600" />
                +${monthlyGrowth} this month
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-xl font-semibold">${totalSaved.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Saved</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-xl font-semibold">${autoConverted.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Auto-Converted</div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Amount to add"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleAddMoney}>
                <DollarSign className="w-4 h-4 mr-2" />
                Add Money
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Savings Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Savings Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">${savingsGoal}</div>
                <div className="text-sm text-muted-foreground">Monthly Target</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{goalProgress.toFixed(1)}%</span>
                </div>
                <Progress value={goalProgress} className="h-2" />
                <div className="text-xs text-muted-foreground text-center">
                  ${(savingsGoal - currentBalance).toFixed(2)} remaining
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Update Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auto-Save Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Auto-Save Settings</CardTitle>
            <CardDescription>Automatically save money to your piggy bank</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Enable Auto-Save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save money weekly
                </p>
              </div>
              <Switch 
                id="auto-save"
                checked={autoSaveEnabled} 
                onCheckedChange={setAutoSaveEnabled}
              />
            </div>

            {autoSaveEnabled && (
              <div>
                <Label htmlFor="weekly-amount">Weekly Amount</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">$</span>
                  <Input
                    id="weekly-amount"
                    type="number"
                    value={weeklyAmount}
                    onChange={(e) => setWeeklyAmount(parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">/week</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll save ${weeklyAmount * 4} per month
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-convert">Auto-Conversion</Label>
                <p className="text-sm text-muted-foreground">
                  Use savings to pay installments automatically
                </p>
              </div>
              <Switch 
                id="auto-convert"
                checked={autoConvertEnabled} 
                onCheckedChange={setAutoConvertEnabled}
              />
            </div>

            {autoConvertEnabled && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Auto-Conversion Active</span>
                </div>
                <p className="text-sm text-green-700">
                  When you have enough balance, we'll automatically use your savings 
                  to prepay installments and save you on interest.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your piggy bank transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowUpCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${transaction.balance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Savings vs Auto-Conversions</CardTitle>
          <CardDescription>Track your piggy bank growth and automatic payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`$${value}`, name === 'saved' ? 'Saved' : 'Auto-Converted']}
                />
                <Bar dataKey="saved" fill="#22c55e" name="saved" />
                <Bar dataKey="converted" fill="#3b82f6" name="converted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}