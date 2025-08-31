import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, Calendar, DollarSign, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstrations
const monthlyData = [
  { month: 'Jan', income: 5000, expenses: 3200, savings: 1800 },
  { month: 'Feb', income: 5200, expenses: 3400, savings: 1800 },
  { month: 'Mar', income: 4800, expenses: 3600, savings: 1200 },
  { month: 'Apr', income: 5500, expenses: 3300, savings: 2200 },
  { month: 'May', income: 5300, expenses: 3500, savings: 1800 },
  { month: 'Jun', income: 5600, expenses: 3400, savings: 2200 },
];

const categoryData = [
  { name: 'Food & Dining', value: 1200, color: '#8884d8' },
  { name: 'Transportation', value: 800, color: '#82ca9d' },
  { name: 'Shopping', value: 600, color: '#ffc658' },
  { name: 'Bills & Utilities', value: 500, color: '#ff7c7c' },
  { name: 'Entertainment', value: 400, color: '#8dd1e1' },
  { name: 'Healthcare', value: 300, color: '#d084d0' },
];

const trendData = [
  { date: '2024-01-01', amount: 3200 },
  { date: '2024-01-08', amount: 3400 },
  { date: '2024-01-15', amount: 3100 },
  { date: '2024-01-22', amount: 3600 },
  { date: '2024-01-29', amount: 3300 },
];

export function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2024');
  const { toast } = useToast();

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    toast({
      title: "Export Started",
      description: `Your ${format.toUpperCase()} report is being generated...`
    });
  };

  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-financial-dark">Reports & Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into your financial patterns</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-financial-success" />
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-financial-success">${totalIncome.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-financial-danger" />
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-financial-danger">${totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-financial-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Net Savings</p>
                <p className="text-2xl font-bold text-financial-primary">${totalSavings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-financial-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                <p className="text-2xl font-bold text-financial-accent">{savingsRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Income vs Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(var(--financial-success))" name="Income" />
                  <Bar dataKey="expenses" fill="hsl(var(--financial-danger))" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => {
                    const total = categoryData.reduce((sum, item) => sum + item.value, 0);
                    const percentage = (category.value / total) * 100;
                    
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${category.value}</p>
                          <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--financial-primary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-financial-success mb-2" />
                <p className="text-sm text-muted-foreground">Average Monthly Growth</p>
                <p className="text-2xl font-bold text-financial-success">+12.5%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto text-financial-primary mb-2" />
                <p className="text-sm text-muted-foreground">Best Savings Month</p>
                <p className="text-2xl font-bold text-financial-primary">April</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto text-financial-accent mb-2" />
                <p className="text-sm text-muted-foreground">Highest Expense Day</p>
                <p className="text-2xl font-bold text-financial-accent">$450</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 border rounded-lg">
                  <Download className="h-8 w-8 mx-auto text-financial-primary mb-4" />
                  <h3 className="font-semibold mb-2">CSV Export</h3>
                  <p className="text-sm text-muted-foreground mb-4">Export raw data for analysis</p>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('csv')}
                    className="w-full"
                  >
                    Download CSV
                  </Button>
                </div>
                
                <div className="text-center p-6 border rounded-lg">
                  <Download className="h-8 w-8 mx-auto text-financial-danger mb-4" />
                  <h3 className="font-semibold mb-2">PDF Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">Formatted report with charts</p>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('pdf')}
                    className="w-full"
                  >
                    Download PDF
                  </Button>
                </div>
                
                <div className="text-center p-6 border rounded-lg">
                  <Download className="h-8 w-8 mx-auto text-financial-success mb-4" />
                  <h3 className="font-semibold mb-2">Excel Export</h3>
                  <p className="text-sm text-muted-foreground mb-4">Spreadsheet with formulas</p>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('excel')}
                    className="w-full"
                  >
                    Download Excel
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Export Options</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Date Range:</p>
                    <p className="text-muted-foreground">Current Year (2024)</p>
                  </div>
                  <div>
                    <p className="font-medium">Data Included:</p>
                    <p className="text-muted-foreground">All transactions & categories</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}