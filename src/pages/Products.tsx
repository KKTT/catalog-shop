import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products as staticProducts, categories } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProductManager } from "@/hooks/useProductManager";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();
  const { getProducts } = useProductManager();

  const productsToShow = searchResults || products;

  const filteredProducts = productsToShow.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
      default:
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    }
  });

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to static products if database fails
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }
    addToCart(product.id, product.name, product.price, product.image_url || product.image);
  };

  const handleWishlistToggle = (product: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save items to your wishlist.",
        variant: "destructive"
      });
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id, product.name, product.price, product.image_url || product.image);
    }
  };

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchResults={handleSearchResults} onClearSearch={handleClearSearch} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-muted-foreground">Discover our complete range of premium outdoor gear</p>
          {searchResults && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {sortedProducts.length} search results
            </p>
          )}
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Loading products...' : `Showing ${sortedProducts.length} of ${products.length} products`}
          </p>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-6"
          }`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-6"
        }`}>
          {sortedProducts.map((product) => (
            <Card key={product.id} className={`group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-gold/20 cursor-pointer ${
              viewMode === "list" ? "flex flex-col md:flex-row" : ""
            }`}
                  onClick={() => window.location.href = `/product/${product.id}`}>
              <CardHeader className={`p-0 ${viewMode === "list" ? "md:w-1/3" : ""}`}>
                <div className="relative overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
                  <img 
                    src={product.image_url || product.image || '/placeholder.svg?height=400&width=400'} 
                    alt={product.name}
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                      viewMode === "list" ? "w-full h-48 md:h-full" : "w-full h-48"
                    }`}
                  />
                  {(product.is_new || product.isNew) && (
                    <Badge className="absolute top-2 left-2 bg-brand-gold text-brand-dark">
                      New
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          user && isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                        }`} 
                      />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <div className={`${viewMode === "list" ? "md:w-2/3 flex flex-col" : ""}`}>
                <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-brand-gold">${product.price}</span>
                      {(product.original_price || product.originalPrice) && (
                        <span className="text-lg text-muted-foreground line-through">${product.original_price || product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-brand-gold">★</span>
                        <span className="text-sm">{product.rating || 0}</span>
                        <span className="text-sm text-muted-foreground">({product.reviews || 0})</span>
                      </div>
                      <Badge variant={(product.in_stock !== false && product.inStock !== false) ? "default" : "destructive"}>
                        {(product.in_stock !== false && product.inStock !== false) ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-brand-dark hover:bg-brand-accent text-white"
                    disabled={product.in_stock === false || product.inStock === false}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
        )}
        
        {/* No Results */}
        {sortedProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;