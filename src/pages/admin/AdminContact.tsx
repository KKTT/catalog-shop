import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Edit, Save, MessageSquare, Clock } from "lucide-react";
import { useContact } from "@/hooks/useContact";
import { useToast } from "@/hooks/use-toast";

// Mock messages since we don't have a messages table yet
const mockMessages = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    subject: "Product Inquiry",
    message: "I have a question about your latest product line.",
    status: "unread",
    createdAt: "2024-01-20"
  },
  {
    id: 2,
    name: "Lisa Johnson",
    email: "lisa@example.com",
    subject: "Order Support",
    message: "I need help with my recent order #12345.",
    status: "replied",
    createdAt: "2024-01-19"
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@example.com",
    subject: "Partnership Opportunity",
    message: "I'd like to discuss a potential business partnership.",
    status: "unread",
    createdAt: "2024-01-18"
  }
];

export function AdminContact() {
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const { contactInfo, loading, updateContactInfo } = useContact();
  const { toast } = useToast();

  const [editedContactInfo, setEditedContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
    business_hours: {},
    support_description: ""
  });

  // Update local state when contactInfo loads
  React.useEffect(() => {
    if (contactInfo) {
      setEditedContactInfo({
        email: contactInfo.email || "",
        phone: contactInfo.phone || "",
        address: contactInfo.address || "",
        business_hours: contactInfo.business_hours || {},
        support_description: contactInfo.support_description || ""
      });
    }
  }, [contactInfo]);

  const handleSave = async () => {
    const success = await updateContactInfo(editedContactInfo);
    if (success) {
      toast({
        title: "Success",
        description: "Contact information updated successfully"
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive"
      });
    }
  };

  const updateMessageStatus = (id: number, status: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, status } : msg
    ));
  };

  if (loading) {
    return <div className="p-6">Loading contact information...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
          <p className="text-muted-foreground">Manage contact information and customer messages</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Update your business contact details</CardDescription>
              </div>
              <Button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                variant={isEditing ? "default" : "outline"}
                size="sm"
              >
                {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={editedContactInfo.email}
                onChange={(e) => setEditedContactInfo({...editedContactInfo, email: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editedContactInfo.phone}
                onChange={(e) => setEditedContactInfo({...editedContactInfo, phone: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={editedContactInfo.address}
                onChange={(e) => setEditedContactInfo({...editedContactInfo, address: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="description">Support Description</Label>
              <Textarea
                id="description"
                value={editedContactInfo.support_description}
                onChange={(e) => setEditedContactInfo({...editedContactInfo, support_description: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
            <CardDescription>Customer inquiries and support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm">{message.name}</h4>
                      <Badge variant={message.status === "unread" ? "destructive" : "default"}>
                        {message.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {message.createdAt}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{message.email}</p>
                  <p className="text-sm font-medium mb-2">{message.subject}</p>
                  <p className="text-sm text-muted-foreground mb-3">{message.message}</p>
                  <div className="flex space-x-2">
                    {message.status === "unread" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateMessageStatus(message.id, "replied")}
                      >
                        Mark as Replied
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-sm text-muted-foreground">Customer inquiries</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.filter(m => m.status === "unread").length}</div>
            <p className="text-sm text-muted-foreground">Pending responses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Responded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.filter(m => m.status === "replied").length}</div>
            <p className="text-sm text-muted-foreground">Resolved inquiries</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}