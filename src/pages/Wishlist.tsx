import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleAddToCart = async (item: typeof wishlistItems[0]) => {
    const success = await addToCart(item.product_id, item.product_name, item.price, item.image_url || undefined);
    if (success) {
      removeFromWishlist(item.product_id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground">Your saved favorite products</p>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">Start adding products you love!</p>
            <Button asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {item.image_url && (
                    <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={item.image_url} 
                        alt={item.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.product_name}</h3>
                  <p className="text-xl font-bold text-primary mb-4">${item.price.toFixed(2)}</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromWishlist(item.product_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;