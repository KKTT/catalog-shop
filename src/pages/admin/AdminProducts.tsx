import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAdmin } from "@/hooks/useAdmin";
import { Package, Plus, Search, Edit, Trash2, X, Upload, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { products as frontendProducts } from "@/data/products";

interface ProductFormData {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  description: string;
  features: string;
  capacity?: string;
  stock_quantity: number;
  in_stock: boolean;
  is_new: boolean;
  is_featured: boolean;
  image_url?: string;
  images: string;
  specifications: string;
}

export function AdminProducts() {
  const { getProducts, deleteProduct, createProduct, updateProduct } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    defaultValues: {
      id: "",
      name: "",
      category: "",
      price: 0,
      original_price: 0,
      description: "",
      features: "",
      capacity: "",
      stock_quantity: 0,
      in_stock: true,
      is_new: false,
      is_featured: false,
      image_url: "",
      images: "",
      specifications: "{}",
    },
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ page: 1, limit: 50 });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        await loadProducts();
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      const productData = {
        ...data,
        features: data.features.split('\n').filter(f => f.trim()),
        images: data.images.split('\n').filter(i => i.trim()),
        specifications: data.specifications ? JSON.parse(data.specifications) : {},
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await createProduct(productData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      setIsCreateDialogOpen(false);
      setEditingProduct(null);
      form.reset();
      await loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    form.reset({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      original_price: product.original_price || 0,
      description: product.description || "",
      features: product.features?.join('\n') || "",
      capacity: product.capacity || "",
      stock_quantity: product.stock_quantity || 0,
      in_stock: product.in_stock ?? true,
      is_new: product.is_new ?? false,
      is_featured: product.is_featured ?? false,
      image_url: product.image_url || "",
      images: product.images?.join('\n') || "",
      specifications: JSON.stringify(product.specifications || {}, null, 2),
    });
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    form.reset();
    setIsCreateDialogOpen(false);
  };

  const importFrontendProducts = async () => {
    try {
      let importedCount = 0;
      let skippedCount = 0;

      for (const product of frontendProducts) {
        try {
          const productData = {
            id: product.id,
            name: product.name,
            category: product.category.toLowerCase().replace(/\s+/g, '-'),
            price: product.price,
            original_price: product.originalPrice || 0,
            description: product.description,
            features: product.features,
            capacity: product.capacity || "",
            stock_quantity: 100, // Default stock
            in_stock: product.inStock,
            is_new: product.isNew || false,
            is_featured: product.isFeatured || false,
            image_url: product.image,
            images: product.images,
            specifications: product.specifications,
          };

          await createProduct(productData);
          importedCount++;
        } catch (error) {
          console.error(`Error importing product ${product.id}:`, error);
          skippedCount++;
        }
      }

      toast({
        title: "Import Complete",
        description: `Successfully imported ${importedCount} products. Skipped ${skippedCount} products.`,
      });

      await loadProducts();
    } catch (error) {
      console.error('Error importing products:', error);
      toast({
        title: "Import Error",
        description: "Failed to import frontend products",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={importFrontendProducts} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Import Frontend Products
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update the product information below.' : 'Fill in the product information below.'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateProduct)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product ID</FormLabel>
                        <FormControl>
                          <Input placeholder="unique-product-id" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="coolers">Coolers</SelectItem>
                            <SelectItem value="camping">Camping</SelectItem>
                            <SelectItem value="dry-bags">Dry Bags</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input placeholder="20L, 40L, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00" 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="original_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00" 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stock_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Product description" 
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features (one per line)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3" 
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Images (one URL per line)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="https://image1.jpg&#10;https://image2.jpg" 
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specifications (JSON format)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder='{"Material": "Stainless Steel", "Weight": "2.5 kg"}' 
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="in_stock"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-2"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>In Stock</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_new"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-2"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>New Product</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-2"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured Product</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Inventory
          </CardTitle>
          <CardDescription>View and manage all products in your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-16 w-16" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-sm font-medium">${product.price}</p>
                  </div>
                  <Badge variant={product.in_stock ? "default" : "secondary"}>
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}