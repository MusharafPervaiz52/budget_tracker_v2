import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TransactionModal } from "@/components/TransactionModal";
import { TransactionFilter } from "@/components/TransactionFilter";
import { ProfilePage } from "@/components/ProfilePage";
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart,
  BarChart3,
  Target,
  Bell,
  Settings,
  Calendar,
  Download,
  Search,
  Filter,
  User,
  Edit,
  Trash2
} from "lucide-react";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  description?: string;
}

interface Budget {
  category: string;
  spent: number;
  limit: number;
  color: string;
}

const FinancialDashboard = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  const [currentBalance] = useState(12450.75);
  const [monthlyIncome] = useState(5600.00);
  const [monthlyExpenses] = useState(3890.25);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', title: 'Salary Deposit', amount: 5600, category: 'Salary', date: '2024-01-01', type: 'income', description: 'Monthly salary' },
    { id: '2', title: 'Grocery Shopping', amount: 89.50, category: 'Food & Dining', date: '2024-01-02', type: 'expense', description: 'Weekly groceries' },
    { id: '3', title: 'Rent Payment', amount: 1200, category: 'Housing', date: '2024-01-03', type: 'expense', description: 'Monthly rent' },
    { id: '4', title: 'Coffee Shop', amount: 5.75, category: 'Food & Dining', date: '2024-01-04', type: 'expense', description: 'Morning coffee' },
    { id: '5', title: 'Gas Station', amount: 65.00, category: 'Transportation', date: '2024-01-05', type: 'expense', description: 'Car fuel' },
    { id: '6', title: 'Freelance Project', amount: 800, category: 'Freelance', date: '2024-01-06', type: 'income', description: 'Web design project' },
  ]);

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

  const budgets: Budget[] = [
    { category: 'Food & Dining', spent: 280, limit: 400, color: 'bg-blue-500' },
    { category: 'Transportation', spent: 150, limit: 200, color: 'bg-green-500' },
    { category: 'Entertainment', spent: 75, limit: 100, color: 'bg-purple-500' },
    { category: 'Healthcare', spent: 45, limit: 150, color: 'bg-yellow-500' },
  ];

  const expenseCategories = [
    { name: 'Food & Dining', amount: 650, percentage: 35, color: 'bg-blue-500' },
    { name: 'Transportation', amount: 420, percentage: 22, color: 'bg-green-500' },
    { name: 'Shopping', amount: 380, percentage: 20, color: 'bg-purple-500' },
    { name: 'Bills & Utilities', amount: 280, percentage: 15, color: 'bg-yellow-500' },
    { name: 'Others', amount: 160, percentage: 8, color: 'bg-gray-500' },
  ];

  // Transaction Management Functions
  const handleAddTransaction = (transaction: Transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setFilteredTransactions(prev => [newTransaction, ...prev]);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    setFilteredTransactions(prev => prev.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setFilteredTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleFilter = (filters: any) => {
    let filtered = [...transactions];

    if (filters.search) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(t => new Date(t.date) >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => new Date(t.date) <= filters.dateTo);
    }

    if (filters.amountMin) {
      filtered = filtered.filter(t => t.amount >= filters.amountMin);
    }

    if (filters.amountMax) {
      filtered = filtered.filter(t => t.amount <= filters.amountMax);
    }

    setFilteredTransactions(filtered);
  };

  const handleClearFilters = () => {
    setFilteredTransactions(transactions);
  };

  if (currentView === 'profile') {
    return <ProfilePage onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Nest Wealth
          </h1>
          <p className="text-muted-foreground mt-1">Manage your financial future</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentView('profile')}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="relative overflow-hidden shadow-glow animate-slide-up">
          <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-primary">
              ${currentBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden shadow-success animate-slide-up delay-100">
          <div className="absolute inset-0 bg-gradient-success opacity-5"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-success">
              ${monthlyIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden animate-slide-up delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-warning">
              ${monthlyExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              -5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Transactions & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <TransactionModal
                  mode="add"
                  onSave={handleAddTransaction}
                >
                  <Button variant="financial" className="h-20 flex-col gap-2">
                    <PlusCircle className="h-6 w-6" />
                    <span className="text-sm">Add Income</span>
                  </Button>
                </TransactionModal>
                
                <TransactionModal
                  mode="add"
                  onSave={handleAddTransaction}
                >
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <TrendingDown className="h-6 w-6" />
                    <span className="text-sm">Add Expense</span>
                  </Button>
                </TransactionModal>
                
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Target className="h-6 w-6" />
                  <span className="text-sm">Set Budget</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">View Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Transactions
              </CardTitle>
              <TransactionModal
                mode="add"
                onSave={handleAddTransaction}
              >
                <Button variant="financial" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </TransactionModal>
            </CardHeader>
            <CardContent className="space-y-4">
              <TransactionFilter 
                onFilter={handleFilter}
                onClear={handleClearFilters}
              />
              <div className="space-y-3">
                {filteredTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-success/10' : 'bg-warning/10'
                      }`}>
                        {transaction.type === 'income' ? 
                          <TrendingUp className="h-4 w-4 text-success" /> : 
                          <TrendingDown className="h-4 w-4 text-warning" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{transaction.title}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'income' ? 'text-success' : 'text-foreground'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <TransactionModal
                          mode="edit"
                          transaction={transaction}
                          onSave={handleUpdateTransaction}
                          onDelete={handleDeleteTransaction}
                        >
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TransactionModal>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Transactions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Budget & Analytics */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgets.map((budget) => (
                <div key={budget.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{budget.category}</span>
                    <Badge variant={budget.spent > budget.limit * 0.8 ? "destructive" : "secondary"}>
                      ${budget.spent} / ${budget.limit}
                    </Badge>
                  </div>
                  <Progress 
                    value={(budget.spent / budget.limit) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {((budget.limit - budget.spent) / budget.limit * 100).toFixed(0)}% remaining
                  </p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                Manage Budgets
              </Button>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenseCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <div>
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.percentage}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${category.amount}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action for Supabase */}
      <Card className="mt-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-primary">Ready to Save Your Data?</h3>
            <p className="text-muted-foreground">
              Connect to Supabase to enable user accounts, data persistence, and all the powerful features you need for a complete financial app.
            </p>
            <Button variant="financial" size="lg" className="animate-pulse-glow">
              Connect to Supabase
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;