import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProductManager } from "@/hooks/useProductManager";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                  {products.length} Product{products.length !== 1 ? 's' : ''} Found
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
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