import { useState } from "react";
import { Calendar, User, Tag, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBlog } from "@/hooks/useBlog";

const Blog = () => {
  const { posts, loading } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Only show published posts
  const publishedPosts = posts.filter(post => post.status === 'published');

  // Get unique categories from posts
  const categories = ["All", ...new Set(publishedPosts.map(post => post.category).filter(Boolean))];

  const filteredPosts = selectedCategory === "All" 
    ? publishedPosts 
    : publishedPosts.filter(post => post.category === selectedCategory);

  const featuredPost = filteredPosts.find(post => post.is_featured) || filteredPosts[0];
  const otherPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

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
                variant={category === selectedCategory ? "default" : "outline"}
                className={category === selectedCategory ? "bg-brand-gold text-brand-dark hover:bg-brand-gold/90" : ""}
                onClick={() => setSelectedCategory(category as string)}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {publishedPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No blog posts available yet.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="mb-16">
                <Card className="overflow-hidden border-brand-gold/20">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative">
                      <img 
                        src={featuredPost.featured_image_url || "/placeholder.svg?height=300&width=400"} 
                        alt={featuredPost.title}
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
                            <span>{featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString() : new Date(featuredPost.created_at).toLocaleDateString()}</span>
                          </div>
                          {featuredPost.author_name && (
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{featuredPost.author_name}</span>
                            </div>
                          )}
                          {featuredPost.category && (
                            <Badge variant="outline">{featuredPost.category}</Badge>
                          )}
                        </div>
                        <h2 className="text-3xl font-bold">{featuredPost.title}</h2>
                        <p className="text-lg text-muted-foreground">{featuredPost.excerpt}</p>
                        <Button className="w-fit bg-brand-dark hover:bg-brand-accent text-white">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            {/* Blog Posts Grid */}
            {otherPosts.length > 0 && (
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post) => (
                    <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-gold/20">
                      <CardHeader className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img 
                            src={post.featured_image_url || "/placeholder.svg?height=300&width=400"} 
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
                              <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                            {post.category && (
                              <Badge variant="outline">{post.category}</Badge>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-brand-gold transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                          
                          <div className="flex items-center justify-between">
                            {post.author_name && (
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>{post.author_name}</span>
                              </div>
                            )}
                            
                            <Button variant="ghost" size="sm" className="text-brand-gold hover:text-brand-dark hover:bg-brand-gold">
                              Read More
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

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
