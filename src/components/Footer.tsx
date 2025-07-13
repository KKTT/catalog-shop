import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-brand-dark to-brand-accent text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/ba431053-7fe9-4034-b7e6-7b1e3b6bb5d4.png" 
              alt="Than Thorn and Tep Sarak"
              className="h-16 w-auto"
            />
            <p className="text-sm text-gray-300">
              Premium outdoor gear and cooling solutions for your adventures. 
              Quality craftsmanship meets innovative design.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-brand-gold hover:text-white hover:bg-brand-gold/20">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-brand-gold hover:text-white hover:bg-brand-gold/20">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-brand-gold hover:text-white hover:bg-brand-gold/20">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-brand-gold hover:text-white hover:bg-brand-gold/20">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-gold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/products" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Our Products
              </Link>
              <Link to="/blog" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link to="/testimonials" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Testimonials
              </Link>
              <Link to="/faq" className="block text-sm text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link to="/contact" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-gold">Product Categories</h3>
            <div className="space-y-2">
              <Link to="/products/soft-cooler" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Soft Coolers
              </Link>
              <Link to="/products/welded-cooler" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Welded Coolers
              </Link>
              <Link to="/products/camping" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Camping Gear
              </Link>
              <Link to="/products/travel" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Travel & Hunting
              </Link>
              <Link to="/products/dry-bag" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Dry Bags
              </Link>
              <Link to="/products/new-collection" className="block text-sm text-gray-300 hover:text-white transition-colors">
                New Collection
              </Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-gold">Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-brand-gold" />
                <span>sarak@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-brand-gold" />
                <span>096-825-5000</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-brand-gold" />
                <span>Business Location</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-brand-gold">Newsletter</h4>
              <p className="text-xs text-gray-300">Subscribe for updates and special offers</p>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Your email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button variant="secondary" size="sm" className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-300">
              © {new Date().getFullYear()} Than Thorn and Tep Sarak. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-300">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/shipping" className="hover:text-white transition-colors">
                Shipping Info
              </Link>
              <Link to="/returns" className="hover:text-white transition-colors">
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;