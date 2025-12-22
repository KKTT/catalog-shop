import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  description?: string;
  features?: string[];
  capacity?: string;
  stock_quantity?: number;
  in_stock?: boolean;
  is_new?: boolean;
  is_featured?: boolean;
  image_url?: string;
  images?: string[];
  specifications?: Record<string, any>;
  rating?: number;
  reviews?: number;
}

export interface ProductFilters {
  category?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  priceRange?: { min: number; max: number };
  search?: string;
}

export const useProductManager = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get all products with optional filters
  const getProducts = async (filters?: ProductFilters) => {
    try {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock);
      }
      if (filters?.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured);
      }
      if (filters?.isNew !== undefined) {
        query = query.eq('is_new', filters.isNew);
      }
      if (filters?.priceRange) {
        query = query.gte('price', filters.priceRange.min).lte('price', filters.priceRange.max);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get single product by ID
  const getProduct = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch product',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new product
  const createProduct = async (productData: ProductData) => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!productData.id || !productData.name || !productData.category || !productData.price) {
        throw new Error('Missing required fields: ID, name, category, and price are required');
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          id: productData.id,
          name: productData.name,
          category: productData.category,
          price: productData.price,
          original_price: productData.original_price || null,
          description: productData.description || null,
          features: productData.features || [],
          capacity: productData.capacity || null,
          stock_quantity: productData.stock_quantity || 0,
          in_stock: productData.in_stock !== undefined ? productData.in_stock : true,
          is_new: productData.is_new || false,
          is_featured: productData.is_featured || false,
          image_url: productData.image_url || null,
          images: productData.images || [],
          specifications: productData.specifications || {},
          rating: productData.rating || 0,
          reviews: productData.reviews || 0,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Product "${productData.name}" created successfully`,
      });

      return data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      const errorMessage = error.message || 'Failed to create product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update existing product
  const updateProduct = async (id: string, productData: Partial<ProductData>) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .update({
          ...productData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Product "${productData.name || id}" updated successfully`,
      });

      return data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      const errorMessage = error.message || 'Failed to update product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      const errorMessage = error.message || 'Failed to delete product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Import products from frontend data
  const importFromFrontend = async (frontendProducts: any[]) => {
    try {
      setLoading(true);
      let importedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      for (const product of frontendProducts) {
        try {
          const productData: ProductData = {
            id: product.id,
            name: product.name,
            category: product.category.toLowerCase().replace(/\s+/g, '-'),
            price: product.price,
            original_price: product.originalPrice || undefined,
            description: product.description,
            features: product.features,
            capacity: product.capacity || undefined,
            stock_quantity: 100, // Default stock
            in_stock: product.inStock !== undefined ? product.inStock : true,
            is_new: product.isNew || false,
            is_featured: product.isFeatured || false,
            image_url: product.image,
            images: product.images,
            specifications: product.specifications,
            rating: product.rating || 0,
            reviews: product.reviews || 0,
          };

          await createProduct(productData);
          importedCount++;
        } catch (error: any) {
          console.error(`Error importing product ${product.id}:`, error);
          errors.push(`${product.name}: ${error.message}`);
          skippedCount++;
        }
      }

      toast({
        title: 'Import Complete',
        description: `Successfully imported ${importedCount} products. Skipped ${skippedCount} products.`,
      });

      return { imported: importedCount, skipped: skippedCount, errors };
    } catch (error: any) {
      console.error('Error in bulk import:', error);
      toast({
        title: 'Import Error',
        description: 'Failed to import products',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get product categories from categories table
  const getCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return data.map(item => item.name);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  // Get product stats
  const getProductStats = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      const stats = {
        total: data.length,
        inStock: data.filter(p => p.in_stock).length,
        outOfStock: data.filter(p => !p.in_stock).length,
        featured: data.filter(p => p.is_featured).length,
        new: data.filter(p => p.is_new).length,
        categories: [...new Set(data.map(p => p.category))].length,
        averagePrice: data.reduce((sum, p) => sum + (p.price || 0), 0) / (data.length || 1),
        totalValue: data.reduce((sum, p) => sum + ((p.price || 0) * (p.stock_quantity || 0)), 0),
      };

      return stats;
    } catch (error) {
      console.error('Error fetching product stats:', error);
      return null;
    }
  };

  return {
    loading,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    importFromFrontend,
    getCategories,
    getProductStats,
  };
};