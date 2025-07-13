import { ChevronDown, Search, HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const faqCategories = [
    {
      category: "Product Information",
      faqs: [
        {
          question: "What makes your coolers different from others in the market?",
          answer: "Our coolers feature premium welded construction that eliminates leak points, superior insulation for extended ice retention, and durable materials designed to withstand harsh outdoor conditions. The welded seams provide 100% leak-proof performance that traditional sewn coolers cannot match."
        },
        {
          question: "How long can your coolers keep ice frozen?",
          answer: "Ice retention varies by model and conditions. Our standard soft coolers maintain ice for 12-24 hours, while our EVA molded base models can keep ice for up to 36 hours. Factors like ambient temperature, ice-to-product ratio, and frequency of opening affect performance."
        },
        {
          question: "Are your products waterproof?",
          answer: "Yes, all our welded coolers and dry bags are 100% waterproof. The welded construction creates watertight seals that prevent any liquid from entering or leaving the interior compartment."
        },
        {
          question: "What's the difference between welded and sewn construction?",
          answer: "Welded construction uses heat and pressure to fuse materials together, creating a seamless, leak-proof bond. Sewn construction uses stitching, which creates holes that can potentially leak over time. Our welded products offer superior durability and waterproof performance."
        }
      ]
    },
    {
      category: "Shipping & Returns",
      faqs: [
        {
          question: "Do you offer free shipping?",
          answer: "Yes, we offer free standard shipping on all orders over $100 within the continental United States. For orders under $100, standard shipping rates apply."
        },
        {
          question: "How long does shipping take?",
          answer: "Standard shipping typically takes 3-7 business days. Expedited shipping options are available at checkout for faster delivery."
        },
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for unused items in original condition. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange."
        },
        {
          question: "Do you ship internationally?",
          answer: "Currently, we ship to the United States and Canada. International shipping to other countries is available for select products. Please contact us for specific shipping rates and availability."
        }
      ]
    },
    {
      category: "Care & Maintenance",
      faqs: [
        {
          question: "How do I clean my cooler?",
          answer: "Clean with mild soap and warm water. For deep cleaning, use a mixture of baking soda and water. Rinse thoroughly and air dry completely before storage. Avoid harsh chemicals or abrasive cleaners that could damage the materials."
        },
        {
          question: "Can I put my cooler in the washing machine?",
          answer: "No, our coolers should not be machine washed. The agitation and harsh detergents can damage the insulation and waterproof coatings. Hand cleaning is recommended for best results."
        },
        {
          question: "How should I store my cooler when not in use?",
          answer: "Store your cooler in a cool, dry place with the lid or zipper open to allow air circulation. This prevents mold and mildew growth and helps maintain the integrity of the materials."
        },
        {
          question: "What should I do if my cooler develops an odor?",
          answer: "Clean thoroughly with a baking soda solution (2 tablespoons per quart of water), rinse well, and air dry completely. For persistent odors, you can also use a mixture of water and white vinegar."
        }
      ]
    },
    {
      category: "Warranty & Support",
      faqs: [
        {
          question: "What warranty do you offer?",
          answer: "We offer a 2-year manufacturer's warranty against defects in materials and workmanship. This covers manufacturing defects but does not cover damage from normal wear, misuse, or accidents."
        },
        {
          question: "How do I make a warranty claim?",
          answer: "Contact our customer service team with your order number, photos of the issue, and a description of the problem. We'll review your claim and provide instructions for return or replacement if covered under warranty."
        },
        {
          question: "Do you offer repairs for damaged products?",
          answer: "For products under warranty, we'll repair or replace defective items. For out-of-warranty items, we can evaluate repair options on a case-by-case basis. Contact us for more information."
        }
      ]
    },
    {
      category: "Usage & Performance",
      faqs: [
        {
          question: "What's the best ice-to-product ratio for maximum ice retention?",
          answer: "For optimal ice retention, use a 2:1 ice-to-product ratio. Pre-chill your cooler and contents before packing, and minimize opening frequency. Block ice typically lasts longer than cubed ice."
        },
        {
          question: "Can I use dry ice in your coolers?",
          answer: "We do not recommend using dry ice in our soft coolers. Dry ice requires special ventilation and can damage soft-sided materials. It's designed for use in hard-sided coolers only."
        },
        {
          question: "Are your coolers bear-proof?",
          answer: "Our coolers are not certified bear-proof. In bear country, always use certified bear canisters or store food in vehicles or bear boxes as recommended by park authorities."
        },
        {
          question: "Can I use your coolers for hot foods?",
          answer: "Yes, our coolers can keep hot foods warm, though they're primarily designed for cooling. For best results with hot foods, pre-warm the cooler with hot water, then add your heated items."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="text-center py-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our products, shipping, and services
          </p>
        </section>

        {/* Search */}
        <section className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search frequently asked questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-lg"
              />
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border-brand-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-gold flex items-center space-x-2">
                  <HelpCircle className="h-6 w-6" />
                  <span>{category.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openItems.includes(globalIndex);
                    
                    return (
                      <Collapsible key={faqIndex} open={isOpen} onOpenChange={() => toggleItem(globalIndex)}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between text-left p-4 h-auto bg-secondary/50 hover:bg-secondary"
                          >
                            <span className="font-medium text-lg">{faq.question}</span>
                            <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* No Results */}
        {filteredFAQs.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or browse our categories above</p>
          </div>
        )}

        {/* Still Need Help */}
        <section className="mt-16 py-12 bg-gradient-to-r from-brand-dark to-brand-accent text-white rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-gray-300">
              Our customer service team is here to assist you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto">
                <Phone className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-xl font-semibold">Call Us</h3>
              <p className="text-gray-300">096-825-5000</p>
              <p className="text-sm text-gray-400">Mon-Fri 9AM-6PM</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-xl font-semibold">Email Us</h3>
              <p className="text-gray-300">sarak@gmail.com</p>
              <p className="text-sm text-gray-400">Response within 24 hours</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-xl font-semibold">Live Chat</h3>
              <p className="text-gray-300">Available Now</p>
              <Button className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
                Start Chat
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;