import { ChevronDown, Search, HelpCircle, MessageCircle, Phone, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFAQ } from "@/hooks/useFAQ";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([0]);
  const { faqs, loading } = useFAQ();

  // Only show published FAQs
  const publishedFAQs = faqs.filter(faq => faq.is_published);

  // Group FAQs by category
  const faqCategories = publishedFAQs.reduce((acc, faq) => {
    const category = faq.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, typeof publishedFAQs>);

  const filteredFAQs = Object.entries(faqCategories).map(([category, categoryFaqs]) => ({
    category,
    faqs: categoryFaqs.filter(faq => 
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
        </div>
        <Footer />
      </div>
    );
  }

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
        {publishedFAQs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No FAQs available yet.</p>
          </div>
        ) : (
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
                        <Collapsible key={faq.id} open={isOpen} onOpenChange={() => toggleItem(globalIndex)}>
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
        )}

        {/* No Results */}
        {filteredFAQs.length === 0 && searchQuery && publishedFAQs.length > 0 && (
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
