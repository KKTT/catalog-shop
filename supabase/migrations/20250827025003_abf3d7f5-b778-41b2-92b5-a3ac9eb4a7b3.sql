-- Create website content tables for admin management

-- Hero section content
CREATE TABLE public.hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  primary_button_text text DEFAULT 'Shop Now',
  secondary_button_text text DEFAULT 'View Catalog',
  hero_image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Enable RLS
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

-- Create policies for hero content
CREATE POLICY "Anyone can view active hero content" 
ON public.hero_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage hero content" 
ON public.hero_content 
FOR ALL 
USING (is_admin(auth.uid()));

-- Features section content
CREATE TABLE public.features_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Enable RLS
ALTER TABLE public.features_content ENABLE ROW LEVEL SECURITY;

-- Create policies for features content
CREATE POLICY "Anyone can view active features" 
ON public.features_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage features" 
ON public.features_content 
FOR ALL 
USING (is_admin(auth.uid()));

-- Company info and mission content
CREATE TABLE public.company_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_title text DEFAULT 'Our Mission',
  mission_description text,
  years_experience integer DEFAULT 15,
  happy_customers integer DEFAULT 50000,
  products_available integer DEFAULT 100,
  company_story text,
  core_values text[],
  team_size integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Enable RLS
ALTER TABLE public.company_content ENABLE ROW LEVEL SECURITY;

-- Create policies for company content
CREATE POLICY "Anyone can view active company content" 
ON public.company_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage company content" 
ON public.company_content 
FOR ALL 
USING (is_admin(auth.uid()));

-- Product categories for homepage
CREATE TABLE public.homepage_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  link_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Enable RLS
ALTER TABLE public.homepage_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for homepage categories
CREATE POLICY "Anyone can view active homepage categories" 
ON public.homepage_categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage homepage categories" 
ON public.homepage_categories 
FOR ALL 
USING (is_admin(auth.uid()));

-- Testimonials content
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_image text,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  product_name text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials
CREATE POLICY "Anyone can view active testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage testimonials" 
ON public.testimonials 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create triggers for updating timestamps
CREATE TRIGGER update_hero_content_updated_at
BEFORE UPDATE ON public.hero_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_features_content_updated_at
BEFORE UPDATE ON public.features_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_content_updated_at
BEFORE UPDATE ON public.company_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_homepage_categories_updated_at
BEFORE UPDATE ON public.homepage_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.hero_content (title, subtitle, description, created_by) VALUES 
('Premium Outdoor Gear for Every Adventure', 'Discover our collection of high-quality coolers, camping gear, and outdoor accessories.', 'Built for durability, designed for performance.', null);

INSERT INTO public.features_content (icon, title, description, sort_order, created_by) VALUES 
('Shield', 'Premium Quality', 'Durable materials and superior craftsmanship', 1, null),
('Truck', 'Free Shipping', 'Free delivery on orders over $100', 2, null),
('Headphones', '24/7 Support', 'Expert customer service always available', 3, null),
('Star', 'Warranty', 'Comprehensive product warranty coverage', 4, null);

INSERT INTO public.company_content (mission_description, company_story, core_values, created_by) VALUES 
('At Than Thorn and Tep Sarak, we''re committed to crafting premium outdoor gear that enhances your adventures. Our innovative designs and superior materials ensure that every product delivers exceptional performance, durability, and reliability in the great outdoors.', 
'Founded with a passion for outdoor adventures, we have been serving outdoor enthusiasts for over 15 years with premium quality gear.', 
ARRAY['Quality First', 'Customer Satisfaction', 'Innovation', 'Sustainability'], 
null);

INSERT INTO public.homepage_categories (name, image_url, link_url, sort_order, created_by) VALUES 
('Soft Coolers', '/placeholder.svg?height=300&width=300', '/products/soft-cooler', 1, null),
('Welded Coolers', '/placeholder.svg?height=300&width=300', '/products/welded-cooler', 2, null),
('Camping Gear', '/placeholder.svg?height=300&width=300', '/products/camping', 3, null),
('Travel & Hunting', '/placeholder.svg?height=300&width=300', '/products/travel', 4, null);

INSERT INTO public.testimonials (customer_name, rating, review_text, product_name, is_featured, created_by) VALUES 
('Sarah Johnson', 5, 'Amazing quality coolers! Kept our drinks cold for the entire weekend camping trip. Highly recommend!', 'Soft Pack Welded Backpack Cooler', true, null),
('Mike Chen', 5, 'The build quality is exceptional. Very durable and perfect for our hunting expeditions.', 'EVA Molded Base Cooler', true, null),
('Emily Davis', 4, 'Great value for money. The welded construction really makes a difference in durability.', 'Welded Tote Cooler', true, null);