import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Search, Edit, Trash2, MessageSquare } from "lucide-react";

const mockTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Manager",
    company: "Tech Corp",
    content: "Amazing service and products! Highly recommend to everyone.",
    rating: 5,
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "CEO",
    company: "StartupXYZ",
    content: "The quality exceeded our expectations. Great customer support too.",
    rating: 5,
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Designer",
    company: "Creative Agency",
    content: "Professional service and beautiful products. Will definitely order again.",
    rating: 4,
    featured: true,
    image: "/placeholder.svg"
  }
];

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const toggleFeatured = (id: number) => {
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, featured: !t.featured } : t
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

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
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{testimonial.role}</span>
                    <span className="text-sm text-muted-foreground">at {testimonial.company}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                    {testimonial.featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{testimonial.content}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleFeatured(testimonial.id)}
                  >
                    {testimonial.featured ? "Unfeature" : "Feature"}
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
              {(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonials.filter(t => t.featured).length}</div>
            <p className="text-sm text-muted-foreground">Featured testimonials</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}