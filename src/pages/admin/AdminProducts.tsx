import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAdmin } from "@/hooks/useAdmin";
import { useProductManager } from "@/hooks/useProductManager";
import { Package, Plus, Search, Edit, Trash2, X, Upload, Download, BarChart3 } from "lucide-react";
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
  const { 
    loading,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    importFromFrontend,
    getProductStats,
    getCategories
  } = useProductManager();
  
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
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
    loadStats();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts({
        ...(selectedCategory && selectedCategory !== "all" && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
      });
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getProductStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Reload products when search or category changes
  useEffect(() => {
    loadProducts();
  }, [searchTerm, selectedCategory]);

  const handleDelete = async (id: string, productName: string) => {
    try {
      await deleteProduct(id);
      await loadProducts();
      toast({
        title: "Success",
        description: `Product "${productName}" deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      // Validate required fields
      if (!data.id || !data.name || !data.category || !data.price) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (ID, Name, Category, Price)",
          variant: "destructive",
        });
        return;
      }

      // Validate JSON specifications
      let parsedSpecs = {};
      if (data.specifications) {
        try {
          parsedSpecs = JSON.parse(data.specifications);
        } catch (error) {
          toast({
            title: "Validation Error",
            description: "Specifications must be valid JSON format",
            variant: "destructive",
          });
          return;
        }
      }

      const productData = {
        ...data,
        features: data.features.split('\n').filter(f => f.trim()),
        images: data.images.split('\n').filter(i => i.trim()),
        specifications: parsedSpecs,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({
          title: "Success",
          description: `Product "${data.name}" updated successfully`,
        });
      } else {
        await createProduct(productData);
        toast({
          title: "Success",
          description: `Product "${data.name}" created successfully`,
        });
      }

      setIsCreateDialogOpen(false);
      setEditingProduct(null);
      form.reset();
      await loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save product";
      toast({
        title: "Error",
        description: errorMessage,
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
      await importFromFrontend(frontendProducts);
      await loadProducts();
      await loadStats();
    } catch (error) {
      console.error('Error importing products:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={importFrontendProducts} variant="outline" disabled={loading}>
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
                        <FormLabel>Product ID *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="unique-product-id" 
                            {...field} 
                            disabled={!!editingProduct}
                          />
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
                        <FormLabel>Product Name *</FormLabel>
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
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <FormLabel>Price *</FormLabel>
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
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.averagePrice.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                    src={product.image_url || '/placeholder.svg'}
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id, product.name)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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