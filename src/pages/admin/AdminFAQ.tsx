import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Plus, Search, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mockFAQs = [
  {
    id: 1,
    question: "How do I track my order?",
    answer: "You can track your order by logging into your account and visiting the Orders section. You'll find tracking information for all your recent purchases.",
    category: "Orders",
    isPublished: true
  },
  {
    id: 2,
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all items in original condition. Please contact our support team to initiate a return.",
    category: "Returns",
    isPublished: true
  },
  {
    id: 3,
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.",
    category: "Shipping",
    isPublished: true
  },
  {
    id: 4,
    question: "How can I cancel my order?",
    answer: "Orders can be cancelled within 24 hours of placement. Please contact customer service for assistance.",
    category: "Orders",
    isPublished: false
  }
];

export function AdminFAQ() {
  const [faqs, setFaqs] = useState(mockFAQs);
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(faq => faq.id !== id));
    }
  };

  const togglePublished = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isPublished: !faq.isPublished } : faq
    ));
  };

  const toggleOpen = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
          <p className="text-muted-foreground">Manage frequently asked questions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            FAQ Items
          </CardTitle>
          <CardDescription>Manage questions and answers for customer support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="border">
                <Collapsible>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{faq.category}</Badge>
                        <Badge variant={faq.isPublished ? "default" : "secondary"}>
                          {faq.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <CollapsibleTrigger 
                        className="flex items-center space-x-2 text-left"
                        onClick={() => toggleOpen(faq.id)}
                      >
                        <h3 className="font-semibold">{faq.question}</h3>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => togglePublished(faq.id)}
                      >
                        {faq.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(faq.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CollapsibleContent>
                    <div className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faqs.length}</div>
            <p className="text-sm text-muted-foreground">Questions available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faqs.filter(f => f.isPublished).length}</div>
            <p className="text-sm text-muted-foreground">Live on website</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-sm text-muted-foreground">Question categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faqs.filter(f => !f.isPublished).length}</div>
            <p className="text-sm text-muted-foreground">Unpublished items</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}