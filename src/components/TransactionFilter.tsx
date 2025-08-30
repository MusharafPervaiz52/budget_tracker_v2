import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Filter, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOptions {
  search: string;
  type: 'all' | 'income' | 'expense';
  category: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  amountMin: number | undefined;
  amountMax: number | undefined;
}

interface TransactionFilterProps {
  onFilter: (filters: FilterOptions) => void;
  onClear: () => void;
}

const categories = [
  'All Categories',
  'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Bonus',
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
  'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Housing', 
  'Insurance', 'Other Income', 'Other Expense'
];

export function TransactionFilter({ onFilter, onClear }: TransactionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    type: 'all',
    category: '',
    dateFrom: undefined,
    dateTo: undefined,
    amountMin: undefined,
    amountMax: undefined
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = {
      search: '',
      type: 'all',
      category: '',
      dateFrom: undefined,
      dateTo: undefined,
      amountMin: undefined,
      amountMax: undefined
    };
    setFilters(clearedFilters);
    onClear();
  };

  const hasActiveFilters = 
    filters.search || 
    filters.type !== 'all' || 
    filters.category || 
    filters.dateFrom || 
    filters.dateTo || 
    filters.amountMin || 
    filters.amountMax;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 space-y-4" align="start">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter Transactions</h4>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Transaction Type */}
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value: 'all' | 'income' | 'expense') => 
                  handleFilterChange('type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category === 'All Categories' ? '' : category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !filters.dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "MMM dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => handleFilterChange('dateFrom', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !filters.dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "MMM dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => handleFilterChange('dateTo', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <Label>Amount Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.amountMin || ''}
                    onChange={(e) => handleFilterChange('amountMin', parseFloat(e.target.value) || undefined)}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.amountMax || ''}
                    onChange={(e) => handleFilterChange('amountMax', parseFloat(e.target.value) || undefined)}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Quick Filter Buttons */}
        <Button 
          variant={filters.type === 'income' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleFilterChange('type', filters.type === 'income' ? 'all' : 'income')}
        >
          Income
        </Button>
        <Button 
          variant={filters.type === 'expense' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleFilterChange('type', filters.type === 'expense' ? 'all' : 'expense')}
        >
          Expense
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}