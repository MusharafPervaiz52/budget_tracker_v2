import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  isDefault: boolean;
}

const defaultCategories: Category[] = [
  // Income categories
  { id: '1', name: 'Salary', type: 'income', color: 'emerald', isDefault: true },
  { id: '2', name: 'Freelance', type: 'income', color: 'blue', isDefault: true },
  { id: '3', name: 'Business', type: 'income', color: 'purple', isDefault: true },
  { id: '4', name: 'Investment', type: 'income', color: 'indigo', isDefault: true },
  
  // Expense categories
  { id: '5', name: 'Food & Dining', type: 'expense', color: 'orange', isDefault: true },
  { id: '6', name: 'Transportation', type: 'expense', color: 'red', isDefault: true },
  { id: '7', name: 'Shopping', type: 'expense', color: 'pink', isDefault: true },
  { id: '8', name: 'Bills & Utilities', type: 'expense', color: 'yellow', isDefault: true },
  { id: '9', name: 'Healthcare', type: 'expense', color: 'green', isDefault: true },
  { id: '10', name: 'Entertainment', type: 'expense', color: 'cyan', isDefault: true },
];

const colors = [
  'emerald', 'blue', 'purple', 'indigo', 'orange', 'red', 
  'pink', 'yellow', 'green', 'cyan', 'violet', 'amber'
];

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    color: 'blue'
  });
  const { toast } = useToast();

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
      toast({
        title: "Success",
        description: "Category updated successfully"
      });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        isDefault: false
      };
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: "Success",
        description: "Category added successfully"
      });
    }

    setIsOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', type: 'expense', color: 'blue' });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category?.isDefault) {
      toast({
        title: "Error",
        description: "Default categories cannot be deleted",
        variant: "destructive"
      });
      return;
    }

    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast({
      title: "Success",
      description: "Category deleted successfully"
    });
  };

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-financial-dark">Categories</h2>
          <p className="text-muted-foreground">Manage your income and expense categories</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="financial" 
              onClick={() => {
                setEditingCategory(null);
                setFormData({ name: '', type: 'expense', color: 'blue' });
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'income' | 'expense') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-primary' : 'border-muted'
                      }`}
                      style={{ backgroundColor: `hsl(var(--${color}))` }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} variant="financial">
                {editingCategory ? 'Update' : 'Add'} Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-financial-success">
              <Tag className="h-5 w-5" />
              Income Categories ({incomeCategories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incomeCategories.map(category => (
                <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: `hsl(var(--${category.color}))` }}
                    />
                    <span className="font-medium">{category.name}</span>
                    {category.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!category.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-financial-danger">
              <Tag className="h-5 w-5" />
              Expense Categories ({expenseCategories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseCategories.map(category => (
                <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: `hsl(var(--${category.color}))` }}
                    />
                    <span className="font-medium">{category.name}</span>
                    {category.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!category.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}