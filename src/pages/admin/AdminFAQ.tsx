import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle, Plus, Search, Edit, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useFAQ, FAQItem } from "@/hooks/useFAQ";
import { useToast } from "@/hooks/use-toast";

export function AdminFAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [saving, setSaving] = useState(false);
  const { faqs, loading, createFAQ, updateFAQ, deleteFAQ } = useFAQ();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
    sort_order: 0,
    is_published: true
  });

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(faq => faq.category))];

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      category: "general",
      sort_order: faqs.length,
      is_published: true
    });
    setEditingFAQ(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (faq: FAQItem) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sort_order,
      is_published: faq.is_published
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      toast({
        title: "Error",
        description: "Question and answer are required",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      let success;
      if (editingFAQ) {
        success = await updateFAQ(editingFAQ.id, formData);
      } else {
        success = await createFAQ(formData);
      }

      if (success) {
        toast({
          title: "Success",
          description: `FAQ ${editingFAQ ? 'updated' : 'created'} successfully`
        });
        setDialogOpen(false);
        resetForm();
      } else {
        toast({
          title: "Error",
          description: `Failed to ${editingFAQ ? 'update' : 'create'} FAQ`,
          variant: "destructive"
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      const success = await deleteFAQ(id);
      if (success) {
        toast({
          title: "Success",
          description: "FAQ deleted successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete FAQ",
          variant: "destructive"
        });
      }
    }
  };

  const togglePublished = async (id: string) => {
    const faq = faqs.find(f => f.id === id);
    if (faq) {
      const success = await updateFAQ(id, { is_published: !faq.is_published });
      if (success) {
        toast({
          title: "Success",
          description: `FAQ ${faq.is_published ? 'unpublished' : 'published'} successfully`
        });
      }
    }
  };

  const toggleOpen = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return <div className="p-6">Loading FAQs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
          <p className="text-muted-foreground">Manage frequently asked questions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
              <DialogDescription>
                {editingFAQ ? 'Update the FAQ details' : 'Add a new frequently asked question'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the question"
                />
              </div>
              <div>
                <Label htmlFor="answer">Answer *</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Enter the answer"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Shipping, Returns"
                  />
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingFAQ ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            {filteredFAQs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No FAQs found. Add your first FAQ!</p>
            ) : (
              filteredFAQs.map((faq) => (
                <Card key={faq.id} className="border">
                  <Collapsible>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{faq.category}</Badge>
                          <Badge variant={faq.is_published ? "default" : "secondary"}>
                            {faq.is_published ? "Published" : "Draft"}
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
                          {faq.is_published ? "Unpublish" : "Publish"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(faq)}>
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
              ))
            )}
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
            <div className="text-2xl font-bold">{faqs.filter(f => f.is_published).length}</div>
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
            <div className="text-2xl font-bold">{faqs.filter(f => !f.is_published).length}</div>
            <p className="text-sm text-muted-foreground">Unpublished items</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
