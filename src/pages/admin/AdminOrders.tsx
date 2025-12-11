import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Activity,
  Search,
  Filter,
  MoreVertical,
  Eye,
  RefreshCw,
  ShoppingBag
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { format } from "date-fns";

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  delivery_fee?: number;
  delivery_address_id?: string;
  profiles?: { full_name: string | null };
  delivery_addresses?: {
    address_line: string;
    city?: string;
    phone_number?: string;
  };
  order_items?: {
    id: string;
    product_name: string;
    quantity: number;
    price: number;
    image_url?: string;
  }[];
}

const statusConfig = {
  pending: { label: "New", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  confirmed: { label: "Confirmed", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  shipping: { label: "Shipping", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  delivered: { label: "Delivered", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  return_requested: { label: "Return Requested", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("drive");
  const { getOrders, updateOrderStatus } = useAdmin();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getOrders({ page: 1, limit: 100 });
      if (result?.orders) {
        setOrders(result.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const filterOrdersByStatus = (statuses: string[]) => {
    return orders.filter(order => {
      const matchesStatus = statuses.includes(order.status);
      const matchesSearch = searchQuery === "" || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  const tabCounts = {
    drive: orders.length,
    new: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    shipping: orders.filter(o => o.status === "shipping").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    monitoring: orders.filter(o => ["pending", "confirmed", "shipping"].includes(o.status)).length,
    return: orders.filter(o => o.status === "return_requested").length,
  };

  const OrdersTable = ({ filteredOrders, showActions = true }: { filteredOrders: Order[], showActions?: boolean }) => (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[120px]">Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 7 : 6} className="text-center py-12">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 opacity-50" />
                  <p>No orders found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-sm">
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{order.profiles?.full_name || "Guest"}</span>
                    <span className="text-xs text-muted-foreground">
                      {order.delivery_addresses?.phone_number || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {order.order_items?.length || 0} item(s)
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ${order.total_amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={statusConfig[order.status as keyof typeof statusConfig]?.color || ""}
                  >
                    {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(order.created_at), "MMM dd, yyyy")}
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {order.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "confirmed")}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Confirm Order
                          </DropdownMenuItem>
                        )}
                        {order.status === "confirmed" && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "shipping")}>
                            <Truck className="h-4 w-4 mr-2" />
                            Mark as Shipping
                          </DropdownMenuItem>
                        )}
                        {order.status === "shipping" && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "delivered")}>
                            <Package className="h-4 w-4 mr-2" />
                            Mark as Delivered
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">Track and manage all customer orders</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="New Orders" value={tabCounts.new} icon={Clock} color="bg-yellow-500/10 text-yellow-600" />
        <StatCard title="Confirmed" value={tabCounts.confirmed} icon={CheckCircle2} color="bg-blue-500/10 text-blue-600" />
        <StatCard title="Shipping" value={tabCounts.shipping} icon={Truck} color="bg-purple-500/10 text-purple-600" />
        <StatCard title="Delivered" value={tabCounts.delivered} icon={Package} color="bg-green-500/10 text-green-600" />
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap gap-1">
          <TabsTrigger value="drive" className="gap-2 data-[state=active]:bg-background">
            <Activity className="h-4 w-4" />
            Drive
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">{tabCounts.drive}</Badge>
          </TabsTrigger>
          <TabsTrigger value="new" className="gap-2 data-[state=active]:bg-background">
            <Clock className="h-4 w-4" />
            New Order
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">{tabCounts.new}</Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="gap-2 data-[state=active]:bg-background">
            <CheckCircle2 className="h-4 w-4" />
            Confirmed
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">{tabCounts.confirmed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2 data-[state=active]:bg-background">
            <Truck className="h-4 w-4" />
            Shipping
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">{tabCounts.shipping}</Badge>
          </TabsTrigger>
          <TabsTrigger value="delivered" className="gap-2 data-[state=active]:bg-background">
            <Package className="h-4 w-4" />
            Delivered
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">{tabCounts.delivered}</Badge>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="gap-2 data-[state=active]:bg-background">
            <Activity className="h-4 w-4" />
            Monitoring
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">{tabCounts.monitoring}</Badge>
          </TabsTrigger>
          <TabsTrigger value="return" className="gap-2 data-[state=active]:bg-background">
            <RotateCcw className="h-4 w-4" />
            Request Return
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">{tabCounts.return}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Drive Tab - All Orders Overview */}
        <TabsContent value="drive" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">All Orders Overview</CardTitle>
              <CardDescription>Complete view of all orders across all statuses</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={orders.filter(order => 
                  searchQuery === "" || 
                  order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  order.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
                )} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Orders Tab */}
        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">New Orders</CardTitle>
              <CardDescription>Orders pending confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={filterOrdersByStatus(["pending"])} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Confirmed Orders Tab */}
        <TabsContent value="confirmed" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Confirmed Orders</CardTitle>
              <CardDescription>Orders confirmed and ready for shipping</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={filterOrdersByStatus(["confirmed"])} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Orders Tab */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Shipping Orders</CardTitle>
              <CardDescription>Orders currently being delivered</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={filterOrdersByStatus(["shipping"])} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivered Orders Tab */}
        <TabsContent value="delivered" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Delivered Orders</CardTitle>
              <CardDescription>Successfully delivered orders</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={filterOrdersByStatus(["delivered"])} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Monitoring</CardTitle>
              <CardDescription>Track orders in progress (pending, confirmed, shipping)</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={filterOrdersByStatus(["pending", "confirmed", "shipping"])} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Return Requests Tab */}
        <TabsContent value="return" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Return Requests</CardTitle>
              <CardDescription>Customer return and refund requests</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={filterOrdersByStatus(["return_requested"])} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
