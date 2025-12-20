import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Plus, Search, Edit, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";
import { useToast } from "@/hooks/use-toast";

export function AdminTestimonials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const { testimonials, loading, createTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_image: "",
    rating: 5,
    review_text: "",
    product_name: "",
    is_featured: false,
    is_active: true
  });

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (testimonial.product_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      customer_name: "",
      customer_image: "",
      rating: 5,
      review_text: "",
      product_name: "",
      is_featured: false,
      is_active: true
    });
    setEditingTestimonial(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customer_name: testimonial.customer_name,
      customer_image: testimonial.customer_image || "",
      rating: testimonial.rating,
      review_text: testimonial.review_text,
      product_name: testimonial.product_name || "",
      is_featured: testimonial.is_featured,
      is_active: testimonial.is_active
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.customer_name || !formData.review_text) {
      toast({
        title: "Error",
        description: "Customer name and review text are required",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      let success;
      if (editingTestimonial) {
        success = await updateTestimonial(editingTestimonial.id, formData);
      } else {
        success = await createTestimonial(formData);
      }

      if (success) {
        toast({
          title: "Success",
          description: `Testimonial ${editingTestimonial ? 'updated' : 'created'} successfully`
        });
        setDialogOpen(false);
        resetForm();
      } else {
        toast({
          title: "Error",
          description: `Failed to ${editingTestimonial ? 'update' : 'create'} testimonial`,
          variant: "destructive"
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const success = await deleteTestimonial(id);
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
              <DialogDescription>
                {editingTestimonial ? 'Update the testimonial details' : 'Add a new customer testimonial'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="customer_image">Customer Image URL</Label>
                <Input
                  id="customer_image"
                  value={formData.customer_image}
                  onChange={(e) => setFormData({ ...formData, customer_image: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div>
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  placeholder="Product they reviewed"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review_text">Review Text *</Label>
                <Textarea
                  id="review_text"
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  placeholder="Customer's review"
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingTestimonial ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            {filteredTestimonials.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No testimonials found. Add your first testimonial!</p>
            ) : (
              filteredTestimonials.map((testimonial) => (
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
                        <Badge variant="default" className="bg-brand-gold text-brand-dark">Featured</Badge>
                      )}
                      {!testimonial.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{testimonial.review_text}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleFeatured(testimonial.id)}
                    >
                      {testimonial.is_featured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(testimonial)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(testimonial.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
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
