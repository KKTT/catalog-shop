import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Truck, Headphones, Heart, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getFeaturedProducts, getNewProducts } from "@/data/products";

const Index = () => {
  const [featuredProducts] = useState(getFeaturedProducts());
  const [newProducts] = useState(getNewProducts());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-dark via-brand-accent to-brand-dark text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Premium <span className="text-brand-gold">Outdoor Gear</span> for Every Adventure
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Discover our collection of high-quality coolers, camping gear, and outdoor accessories. 
                Built for durability, designed for performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 text-lg px-8 py-4">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-dark text-lg px-8 py-4">
                  View Catalog
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-gold/20 rounded-full blur-3xl"></div>
              <img 
                src="/placeholder.svg?height=600&width=600" 
                alt="Featured Products"
                className="relative z-10 w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-lg font-semibold">Premium Quality</h3>
              <p className="text-muted-foreground">Durable materials and superior craftsmanship</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-lg font-semibold">Free Shipping</h3>
              <p className="text-muted-foreground">Free delivery on orders over $100</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-lg font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground">Expert customer service always available</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-lg font-semibold">Warranty</h3>
              <p className="text-muted-foreground">Comprehensive product warranty coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground">Discover our most popular outdoor gear</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-gold/20">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isNew && (
                      <Badge className="absolute top-2 left-2 bg-brand-gold text-brand-dark">
                        New
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Search className="h-4 w-4" />
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
                      {product.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full bg-brand-dark hover:bg-brand-accent text-white">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl leading-relaxed text-gray-300 mb-8">
              At Than Thorn and Tep Sarak, we're committed to crafting premium outdoor gear that enhances your adventures. 
              Our innovative designs and superior materials ensure that every product delivers exceptional performance, 
              durability, and reliability in the great outdoors.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-brand-gold mb-2">15+</h3>
                <p>Years of Experience</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-brand-gold mb-2">50K+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-brand-gold mb-2">100+</h3>
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
            {[
              { name: "Soft Coolers", image: "/placeholder.svg?height=300&width=300", link: "/products/soft-cooler" },
              { name: "Welded Coolers", image: "/placeholder.svg?height=300&width=300", link: "/products/welded-cooler" },
              { name: "Camping Gear", image: "/placeholder.svg?height=300&width=300", link: "/products/camping" },
              { name: "Travel & Hunting", image: "/placeholder.svg?height=300&width=300", link: "/products/travel" }
            ].map((category) => (
              <Link key={category.name} to={category.link} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-gold/20">
                  <div className="relative">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
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
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                review: "Amazing quality coolers! Kept our drinks cold for the entire weekend camping trip. Highly recommend!",
                product: "Soft Pack Welded Backpack Cooler"
              },
              {
                name: "Mike Chen", 
                rating: 5,
                review: "The build quality is exceptional. Very durable and perfect for our hunting expeditions.",
                product: "EVA Molded Base Cooler"
              },
              {
                name: "Emily Davis",
                rating: 4,
                review: "Great value for money. The welded construction really makes a difference in durability.",
                product: "Welded Tote Cooler"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-brand-gold/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-brand-gold fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.review}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.product}</p>
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
