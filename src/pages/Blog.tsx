import { Calendar, User, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Items for Your Next Camping Trip",
      excerpt: "Discover the must-have gear that will make your camping experience comfortable and memorable.",
      image: "/placeholder.svg?height=300&width=400",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Camping",
      tags: ["camping", "gear", "outdoors"]
    },
    {
      id: 2,
      title: "How to Choose the Right Cooler for Your Needs",
      excerpt: "A comprehensive guide to selecting the perfect cooler based on your specific requirements.",
      image: "/placeholder.svg?height=300&width=400",
      author: "Mike Chen",
      date: "2024-01-10",
      category: "Coolers",
      tags: ["coolers", "buying guide", "reviews"]
    },
    {
      id: 3,
      title: "Maintaining Your Outdoor Gear: Tips and Tricks",
      excerpt: "Learn how to properly care for your outdoor equipment to ensure it lasts for years to come.",
      image: "/placeholder.svg?height=300&width=400",
      author: "Emily Davis",
      date: "2024-01-05",
      category: "Maintenance",
      tags: ["maintenance", "care", "tips"]
    },
    {
      id: 4,
      title: "Best Hiking Trails for Beginners",
      excerpt: "Explore these beginner-friendly trails that offer beautiful scenery and manageable challenges.",
      image: "/placeholder.svg?height=300&width=400",
      author: "David Wilson",
      date: "2023-12-28",
      category: "Hiking",
      tags: ["hiking", "trails", "beginners"]
    },
    {
      id: 5,
      title: "Winter Camping: What You Need to Know",
      excerpt: "Essential tips and gear recommendations for safe and enjoyable winter camping adventures.",
      image: "/placeholder.svg?height=300&width=400",
      author: "Lisa Thompson",
      date: "2023-12-20",
      category: "Winter",
      tags: ["winter", "camping", "cold weather"]
    },
    {
      id: 6,
      title: "Sustainable Outdoor Practices",
      excerpt: "How to enjoy the outdoors while minimizing your environmental impact.",
      image: "/placeholder.svg?height=300&width=400",
      author: "Than Thorn",
      date: "2023-12-15",
      category: "Sustainability",
      tags: ["sustainability", "environment", "conservation"]
    }
  ];

  const categories = ["All", "Camping", "Coolers", "Hiking", "Winter", "Maintenance", "Sustainability"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="text-center py-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover tips, guides, and insights to enhance your outdoor adventures
          </p>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? "bg-brand-gold text-brand-dark hover:bg-brand-gold/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Featured Post */}
        <section className="mb-16">
          <Card className="overflow-hidden border-brand-gold/20">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-brand-gold text-brand-dark">
                  Featured
                </Badge>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{blogPosts[0].date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{blogPosts[0].author}</span>
                    </div>
                    <Badge variant="outline">{blogPosts[0].category}</Badge>
                  </div>
                  <h2 className="text-3xl font-bold">{blogPosts[0].title}</h2>
                  <p className="text-lg text-muted-foreground">{blogPosts[0].excerpt}</p>
                  <Button className="w-fit bg-brand-dark hover:bg-brand-accent text-white">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-gold/20">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-brand-gold transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-brand-gold hover:text-brand-dark hover:bg-brand-gold">
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Tag className="h-3 w-3" />
                          <span>{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Load More */}
        <section className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white">
            Load More Articles
          </Button>
        </section>

        {/* Newsletter */}
        <section className="mt-16 py-12 bg-gradient-to-r from-brand-dark to-brand-accent text-white rounded-lg">
          <div className="text-center max-w-2xl mx-auto px-8">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to our blog newsletter and never miss the latest outdoor tips and guides.
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
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;