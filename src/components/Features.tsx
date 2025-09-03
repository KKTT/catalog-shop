import { 
  Shield, 
  Truck, 
  Headphones, 
  Star, 
  Award, 
  Clock, 
  Heart, 
  ThumbsUp,
  Zap,
  Globe,
  CheckCircle,
  Gift,
  Users,
  MapPin,
  Leaf,
  Mountain
} from "lucide-react";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

const Features = () => {
  const { features, loading } = useWebsiteContent();

  // Icon mapping for all possible feature icons
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Shield,
      Truck,
      Headphones,
      Star,
      Award,
      Clock,
      Heart,
      ThumbsUp,
      Zap,
      Globe,
      CheckCircle,
      Gift,
      Users,
      MapPin,
      Leaf,
      Mountain
    };
    
    return iconMap[iconName] || Shield;
  };

  if (loading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted/50 rounded-full animate-pulse mx-auto"></div>
                <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
                <div className="h-12 bg-muted/30 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-xl text-muted-foreground">Experience the difference with our premium features</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.length > 0 ? features
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((feature) => {
              const IconComponent = getIconComponent(feature.icon);
              
              return (
                <div key={feature.id} className="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            }) : (
            // Fallback default features
            <>
              <div className="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Premium Quality</h3>
                <p className="text-muted-foreground text-sm">Durable materials and superior craftsmanship</p>
              </div>
              <div className="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Free Shipping</h3>
                <p className="text-muted-foreground text-sm">Free delivery on orders over $100</p>
              </div>
              <div className="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow">
                  <Headphones className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">24/7 Support</h3>
                <p className="text-muted-foreground text-sm">Expert customer service always available</p>
              </div>
              <div className="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Warranty</h3>
                <p className="text-muted-foreground text-sm">Comprehensive product warranty coverage</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Features;