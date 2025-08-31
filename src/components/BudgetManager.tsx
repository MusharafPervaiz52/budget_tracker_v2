import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Target, AlertTriangle, CheckCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
}

const mockBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food & Dining',
    amount: 500,
    spent: 320,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  },
  {
    id: '2',
    category: 'Transportation',
    amount: 200,
    spent: 180,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  },
  {
    id: '3',
    category: 'Entertainment',
    amount: 150,
    spent: 75,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  }
];

const categories = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
  'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Housing'
];

export function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [isOpen, setIsOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'weekly' | 'monthly'
  });
  const { toast } = useToast();

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'destructive', icon: AlertTriangle };
    if (percentage >= 80) return { status: 'warning', color: 'warning', icon: AlertTriangle };
    return { status: 'good', color: 'success', icon: CheckCircle };
  };

  const handleSave = () => {
    if (!formData.category || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    // Calculate dates based on period
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    if (editingBudget) {
      setBudgets(prev => prev.map(budget => 
        budget.id === editingBudget.id 
          ? { 
              ...budget, 
              category: formData.category,
              amount,
              period: formData.period,
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0]
            }
          : budget
      ));
      toast({
        title: "Success",
        description: "Budget updated successfully"
      });
    } else {
      const newBudget: Budget = {
        id: Date.now().toString(),
        category: formData.category,
        amount,
        spent: 0,
        period: formData.period,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
      setBudgets(prev => [...prev, newBudget]);
      toast({
        title: "Success",
        description: "Budget created successfully"
      });
    }

    setIsOpen(false);
    setEditingBudget(null);
    setFormData({ category: '', amount: '', period: 'monthly' });
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
    toast({
      title: "Success",
      description: "Budget deleted successfully"
    });
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-financial-dark">Budget Management</h2>
          <p className="text-muted-foreground">Track and manage your spending limits</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="financial"
              onClick={() => {
                setEditingBudget(null);
                setFormData({ category: '', amount: '', period: 'monthly' });
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Create New Budget'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value: 'weekly' | 'monthly') => 
                    setFormData(prev => ({ ...prev, period: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} variant="financial">
                {editingBudget ? 'Update' : 'Create'} Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Budget Summary */}
      <Card className="bg-gradient-to-r from-financial-primary/10 to-financial-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-financial-primary" />
            Overall Budget Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold text-financial-primary">${totalBudget.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-financial-danger">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-financial-success">${(totalBudget - totalSpent).toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{overallProgress.toFixed(1)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Individual Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => {
          const { status, color, icon: StatusIcon } = getBudgetStatus(budget);
          const percentage = (budget.spent / budget.amount) * 100;
          
          return (
            <Card key={budget.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{budget.category}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(budget)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(budget.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <Badge variant={color === 'destructive' ? 'destructive' : 'secondary'} className="w-fit">
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status === 'exceeded' ? 'Over Budget' : status === 'warning' ? 'Near Limit' : 'On Track'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Spent: ${budget.spent.toFixed(2)}</span>
                    <span>Budget: ${budget.amount.toFixed(2)}</span>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span>${(budget.amount - budget.spent).toFixed(2)} left</span>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {budget.period} budget
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <Card className="p-12 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No budgets created yet</h3>
          <p className="text-muted-foreground mb-4">Start by creating your first budget to track your spending</p>
          <Button variant="financial" onClick={() => setIsOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        </Card>
      )}
    </div>
  );
}