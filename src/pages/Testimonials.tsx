import { Star, Quote, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTestimonials } from "@/hooks/useTestimonials";

const Testimonials = () => {
  const { testimonials, loading } = useTestimonials();

  // Only show active testimonials
  const activeTestimonials = testimonials.filter(t => t.is_active);

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: activeTestimonials.length > 0 ? (activeTestimonials.reduce((sum, t) => sum + t.rating, 0) / activeTestimonials.length).toFixed(1) + "/5" : "5/5", label: "Average Rating" },
    { number: "15+", label: "Years of Excellence" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="text-center py-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Customer Testimonials</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear what our customers have to say about their experiences with our products
          </p>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gradient-to-r from-brand-dark to-brand-accent text-white rounded-lg mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-3xl lg:text-4xl font-bold text-brand-gold mb-2">{stat.number}</h3>
                <p className="text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Grid */}
        {activeTestimonials.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No testimonials available yet.</p>
          </div>
        ) : (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="relative overflow-hidden border-2 hover:border-brand-gold/20 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    {/* Quote Icon */}
                    <Quote className="h-8 w-8 text-brand-gold/30 absolute top-4 right-4" />
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < testimonial.rating ? 'text-brand-gold fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>

                    {/* Review */}
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "{testimonial.review_text}"
                    </p>

                    {/* Product */}
                    {testimonial.product_name && (
                      <div className="mb-4">
                        <Badge variant="outline" className="text-xs">
                          {testimonial.product_name}
                        </Badge>
                      </div>
                    )}

                    {/* Customer Info */}
                    <div className="flex items-center space-x-3">
                      <img 
                        src={testimonial.customer_image || "/placeholder.svg?height=100&width=100"} 
                        alt={testimonial.customer_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{testimonial.customer_name}</h4>
                          {testimonial.is_featured && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Share Your Experience */}
        <section className="py-16 mt-16 bg-secondary/50 rounded-lg text-center">
          <div className="max-w-2xl mx-auto px-8">
            <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
            <p className="text-xl text-muted-foreground mb-8">
              We'd love to hear about your adventures with our products. Share your story and help other outdoor enthusiasts make informed decisions.
            </p>
            <div className="space-y-4">
              <button className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 font-medium py-3 px-8 rounded-lg transition-colors">
                Write a Review
              </button>
              <p className="text-sm text-muted-foreground">
                All reviews are verified and help us improve our products
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Testimonials;
