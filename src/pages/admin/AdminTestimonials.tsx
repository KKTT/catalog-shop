import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Search, Edit, Trash2, MessageSquare } from "lucide-react";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { useToast } from "@/hooks/use-toast";

export function AdminTestimonials() {
  const [searchTerm, setSearchTerm] = useState("");
  const { testimonials, loading, updateTestimonial } = useWebsiteContent();
  const { toast } = useToast();

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const success = await updateTestimonial(id, { is_active: false });
      if (success) {
        toast({
          title: "Success",
          description: "Testimonial deleted successfully"
        });
      } else {
        toast({
          title: "Error", 
          description: "Failed to delete testimonial",
          variant: "destructive"
        });
      }
    }
  };

  const toggleFeatured = async (id: string) => {
    const testimonial = testimonials.find(t => t.id === id);
    if (testimonial) {
      const success = await updateTestimonial(id, { is_featured: !testimonial.is_featured });
      if (success) {
        toast({
          title: "Success",
          description: `Testimonial ${testimonial.is_featured ? 'unfeatured' : 'featured'} successfully`
        });
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return <div className="p-6">Loading testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials Management</h1>
          <p className="text-muted-foreground">Manage customer testimonials and reviews</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Testimonials
          </CardTitle>
          <CardDescription>View and manage customer feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                {testimonial.customer_image && (
                  <img
                    src={testimonial.customer_image}
                    alt={testimonial.customer_name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{testimonial.customer_name}</h3>
                    {testimonial.product_name && (
                      <>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{testimonial.product_name}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                    {testimonial.is_featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{testimonial.review_text}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleFeatured(testimonial.id)}
                  >
                    {testimonial.is_featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonials.length}</div>
            <p className="text-sm text-muted-foreground">Customer testimonials</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0'}
            </div>
            <p className="text-sm text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonials.filter(t => t.is_featured).length}</div>
            <p className="text-sm text-muted-foreground">Featured testimonials</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}