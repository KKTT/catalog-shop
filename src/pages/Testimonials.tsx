import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "California, USA",
      rating: 5,
      product: "Soft Pack Welded Backpack Cooler 20 Cans",
      review: "This cooler is absolutely amazing! We took it on a 3-day camping trip and it kept our drinks ice cold the entire time. The welded construction is incredibly durable and the backpack design made it so easy to carry on hikes. Best investment for outdoor adventures!",
      image: "/placeholder.svg?height=100&width=100",
      verified: true
    },
    {
      id: 2,
      name: "Mike Chen",
      location: "Texas, USA",
      rating: 5,
      product: "EVA Molded Base Welded Cooler",
      review: "The build quality is exceptional. I've been using outdoor gear for over 15 years and this is hands down the best cooler I've ever owned. The EVA base provides excellent stability and the ice retention is incredible. Worth every penny!",
      image: "/placeholder.svg?height=100&width=100",
      verified: true
    },
    {
      id: 3,
      name: "Emily Davis",
      location: "Colorado, USA",
      rating: 4,
      product: "Soft Pack Welded Tote Cooler 30 Cans",
      review: "Great value for money. The 30-can capacity is perfect for family outings and beach trips. The welded construction really makes a difference - no leaks whatsoever. The only minor issue is that it gets a bit heavy when fully loaded, but that's expected.",
      image: "/placeholder.svg?height=100&width=100",
      verified: true
    },
    {
      id: 4,
      name: "David Wilson",
      location: "Florida, USA",
      rating: 5,
      product: "Premium Camping Tent",
      review: "Survived multiple storms and heavy rain without any issues. Setup is incredibly easy - took us less than 10 minutes even in windy conditions. The material quality is top-notch and the space inside is very comfortable for 4 people. Highly recommend!",
      image: "/placeholder.svg?height=100&width=100",
      verified: true
    },
    {
      id: 5,
      name: "Lisa Thompson",
      location: "Oregon, USA",
      rating: 5,
      product: "Hot Waterproof Bucket Bag 10L",
      review: "Perfect for kayaking and water sports! Completely waterproof as advertised. I've dropped it in the water multiple times and everything inside stays perfectly dry. The bucket design is genius - so versatile and practical.",
      image: "/placeholder.svg?height=100&width=100",
      verified: true
    },
    {
      id: 6,
      name: "Robert Martinez",
      location: "Arizona, USA",
      rating: 5,
      product: "Soft Pack Welded Cooler 24 Cans",
      review: "This cooler has exceeded all my expectations. Perfect size for day trips and the welded seams ensure no leaks. Ice retention is excellent - kept drinks cold for over 24 hours in 100°F desert heat. Customer service is also outstanding!",
      image: "/placeholder.svg?height=100&width=100",
      verified: true
    },
    {
      id: 7,
      name: "Jennifer Lee",
      location: "Washington, USA",
      rating: 4,
      product: "Soft Cooler 18 Cans",
      review: "Good quality cooler for the price point. Keeps drinks cold for most of the day and the shoulder strap is comfortable. Not as heavy-duty as the welded models but perfect for casual use. Would buy again.",
      image: "/placeholder.svg?height=100&width=100",
      verified: true
    },
    {
      id: 8,
      name: "Mark Thompson",
      location: "Montana, USA",
      rating: 5,
      product: "Soft Pack Welded Cooler 12 Cans",
      review: "Compact yet incredibly functional. Perfect for solo hiking trips or short outings. The welded construction gives me confidence it will last for years. Love the lightweight design without compromising on insulation performance.",
      image: "/placeholder.svg?height=100&width=100",
      verified: true
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "4.8/5", label: "Average Rating" },
    { number: "15+", label: "Years of Excellence" }
  ];

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
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
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
                    "{testimonial.review}"
                  </p>

                  {/* Product */}
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs">
                      {testimonial.product}
                    </Badge>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center space-x-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Video Testimonials Section */}
        <section className="py-16 mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Video Testimonials</h2>
            <p className="text-xl text-muted-foreground">See our customers share their experiences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((video) => (
              <Card key={video} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img 
                    src={`/placeholder.svg?height=200&width=350`} 
                    alt={`Video Testimonial ${video}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-dark ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l7-5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Customer Review #{video}</h3>
                  <p className="text-sm text-muted-foreground">Real customer sharing their outdoor experience</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Share Your Experience */}
        <section className="py-16 bg-secondary/50 rounded-lg text-center">
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