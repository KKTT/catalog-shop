import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Mail, Package, DollarSign } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { orders, getTotalOrders, getTotalSpent } = useOrders();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone_number: profile?.phone_number || ''
  });

  if (profileLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    }
  };

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="text-xl">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  {editing ? (
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {profile?.full_name || 'Not set'}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  {editing ? (
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {profile?.phone_number || 'Not set'}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{getTotalOrders()}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">${getTotalSpent().toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile?.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.order_items?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                    <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}