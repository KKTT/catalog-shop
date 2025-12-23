import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Truck, Headphones, Heart, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import { useProductManager } from "@/hooks/useProductManager";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { getProducts } = useProductManager();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const { 
    heroContent, 
    features, 
    companyContent, 
    categories: websiteCategories, 
    testimonials: websiteTestimonials,
    loading: contentLoading 
  } = useWebsiteContent();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await getProducts({ isFeatured: true });
        setFeaturedProducts(products.slice(0, 8)); // Show max 8 featured products
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [getProducts]);

  const handleAddToCart = async (product: any) => {
    const success = await addToCart(product.id, product.name, product.price, product.image_url);
    // No need for additional feedback - the cart hook handles this
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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-dark via-brand-accent to-brand-dark text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {heroContent ? (
                  <span dangerouslySetInnerHTML={{ 
                    __html: heroContent.title.replace(/Outdoor Gear/, '<span class="text-brand-gold">Outdoor Gear</span>') 
                  }} />
                ) : (
                  <>Premium <span className="text-brand-gold">Outdoor Gear</span> for Every Adventure</>
                )}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                {heroContent?.description || "Discover our collection of high-quality coolers, camping gear, and outdoor accessories. Built for durability, designed for performance."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 text-lg px-8 py-4">
                  {heroContent?.primary_button_text || "Shop Now"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-dark text-lg px-8 py-4">
                  {heroContent?.secondary_button_text || "View Catalog"}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-gold/20 rounded-full blur-3xl"></div>
              <img 
                src={heroContent?.hero_image_url || "/placeholder.svg?height=600&width=600"} 
                alt="Featured Products"
                className="relative z-10 w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground">Discover our most popular outdoor gear</p>
          </div>
          
          {productsLoading ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-gold/20 cursor-pointer"
                      onClick={() => window.location.href = `/product/${product.id}`}>
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
          )}
          
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Company Mission */}
      <section className="py-16 bg-gradient-to-r from-brand-dark to-brand-accent text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {companyContent?.mission_title || "Our Mission"}
            </h2>
            <p className="text-xl leading-relaxed text-gray-300 mb-8">
              {companyContent?.mission_description || 
                "At Than Thorn and Tep Sarak, we're committed to crafting premium outdoor gear that enhances your adventures. Our innovative designs and superior materials ensure that every product delivers exceptional performance, durability, and reliability in the great outdoors."
              }
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-brand-gold mb-2">
                  {companyContent?.years_experience || 15}+
                </h3>
                <p>Years of Experience</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-brand-gold mb-2">
                  {companyContent?.happy_customers ? `${Math.floor(companyContent.happy_customers / 1000)}K+` : '50K+'}
                </h3>
                <p>Happy Customers</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-brand-gold mb-2">
                  {companyContent?.products_available || 100}+
                </h3>
                <p>Products Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-muted-foreground">Find the perfect gear for your next adventure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(websiteCategories.length > 0 ? websiteCategories : [
              { id: '1', name: "Soft Coolers", is_active: true },
              { id: '2', name: "Welded Coolers", is_active: true },
              { id: '3', name: "Camping Gear", is_active: true },
              { id: '4', name: "Travel & Hunting", is_active: true }
            ]).map((category) => (
              <Link key={category.id} to={`/category/${encodeURIComponent(category.name)}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-gold/20">
                  <div className="relative h-48 bg-gradient-to-br from-brand-dark to-brand-accent flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground">Real reviews from real adventurers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(websiteTestimonials.length > 0 ? websiteTestimonials : [
              {
                id: '1',
                customer_name: "Sarah Johnson",
                rating: 5,
                review_text: "Amazing quality coolers! Kept our drinks cold for the entire weekend camping trip. Highly recommend!",
                product_name: "Soft Pack Welded Backpack Cooler"
              },
              {
                id: '2',
                customer_name: "Mike Chen", 
                rating: 5,
                review_text: "The build quality is exceptional. Very durable and perfect for our hunting expeditions.",
                product_name: "EVA Molded Base Cooler"
              },
              {
                id: '3',
                customer_name: "Emily Davis",
                rating: 4,
                review_text: "Great value for money. The welded construction really makes a difference in durability.",
                product_name: "Welded Tote Cooler"
              }
            ]).map((testimonial) => (
              <Card key={testimonial.id} className="border-brand-gold/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-brand-gold fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.review_text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.product_name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/testimonials">
              <Button variant="outline" size="lg" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white">
                Read More Reviews
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter & CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-dark via-brand-accent to-brand-dark text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to our newsletter for the latest products, exclusive offers, and outdoor tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg text-brand-dark"
              />
              <Button size="lg" className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
