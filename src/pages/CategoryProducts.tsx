import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Search, Star, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProductManager } from "@/hooks/useProductManager";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const { getProducts } = useProductManager();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  const categoryNames = {
    'soft-cooler': 'Soft Coolers',
    'welded-cooler': 'Welded Coolers', 
    'camping': 'Camping Gear',
    'travel': 'Travel & Hunting'
  };

  const categoryName = categoryNames[category] || category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        const allProducts = await getProducts({});
        // Filter products by category (you can enhance this based on your product categorization)
        const filteredProducts = allProducts.filter(product => 
          product.category?.toLowerCase().includes(category?.toLowerCase()) ||
          product.name?.toLowerCase().includes(category?.toLowerCase()) ||
          (category === 'soft-cooler' && product.name?.toLowerCase().includes('soft')) ||
          (category === 'welded-cooler' && product.name?.toLowerCase().includes('welded')) ||
          (category === 'camping' && product.category?.toLowerCase().includes('camping')) ||
          (category === 'travel' && (product.category?.toLowerCase().includes('travel') || product.category?.toLowerCase().includes('hunting')))
        );
        setProducts(filteredProducts);
        setFilteredProducts(filteredProducts);
      } catch (error) {
        console.error('Error loading category products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      loadCategoryProducts();
    }
  }, [category, getProducts]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by stock status
    if (showOnlyInStock) {
      filtered = filtered.filter(product => product.in_stock);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, sortBy, priceRange, showOnlyInStock]);

  const handleAddToCart = async (product: any) => {
    await addToCart(product.id, product.name, product.price, product.image_url);
  };

  const handleWishlistToggle = async (product: any) => {
    const isInWishlist = wishlistItems.some(item => item.product_id === product.id);
    if (isInWishlist) {
      const item = wishlistItems.find(item => item.product_id === product.id);
      if (item) await removeFromWishlist(item.id);
    } else {
      await addToWishlist(product.id, product.name, product.price, product.image_url);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Category Hero */}
      <section className="bg-gradient-to-r from-brand-dark to-brand-accent text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{categoryName}</h1>
            <p className="text-xl text-gray-300">
              Discover our premium {categoryName?.toLowerCase()} collection
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Filter and Sort Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                </h2>
                
                <div className="flex flex-wrap items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="price-low">Price (Low to High)</SelectItem>
                        <SelectItem value="price-high">Price (High to Low)</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Filter Products</SheetTitle>
                      </SheetHeader>
                      
                      <div className="space-y-6 mt-6">
                        {/* Price Range */}
                        <div>
                          <h4 className="font-medium mb-3">Price Range</h4>
                          <div className="space-y-3">
                            <Slider
                              value={priceRange}
                              onValueChange={setPriceRange}
                              max={1000}
                              min={0}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>${priceRange[0]}</span>
                              <span>${priceRange[1]}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stock Status */}
                        <div>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={showOnlyInStock}
                              onChange={(e) => setShowOnlyInStock(e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm font-medium">In Stock Only</span>
                          </label>
                        </div>

                        {/* Reset Filters */}
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setPriceRange([0, 1000]);
                            setShowOnlyInStock(false);
                            setSortBy("name");
                          }}
                          className="w-full"
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-gold/20">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={product.image_url || "/placeholder.svg?height=400&width=400"} 
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.is_new && (
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
                              e.preventDefault();
                              e.stopPropagation();
                              handleWishlistToggle(product);
                            }}
                          >
                            <Heart 
                              className={`h-4 w-4 ${
                                user && wishlistItems.some(item => item.product_id === product.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : ''
                              }`} 
                            />
                          </Button>
                          <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white" asChild>
                            <Link to={`/product/${product.id}`}>
                              <Search className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-brand-gold fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-sm text-muted-foreground">({product.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-brand-gold">${product.price}</span>
                          {product.original_price && (
                            <span className="text-lg text-muted-foreground line-through">${product.original_price}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full bg-brand-dark hover:bg-brand-accent text-white"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4">No Products Found</h3>
              <p className="text-muted-foreground mb-8">
                We don't have any products in this category yet.
              </p>
              <Link to="/products">
                <Button className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
                  Browse All Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryProducts;