import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';

interface SearchBarProps {
  onSearchResults: (results: typeof products) => void;
  onClearSearch: () => void;
}

export function SearchBar({ onSearchResults, onClearSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      onClearSearch();
      return;
    }

    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.description.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase())
    );

    onSearchResults(filteredProducts);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onClearSearch();
  };

  return (
    <div className="relative flex items-center gap-2 max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}