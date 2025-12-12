import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  ShoppingBag,
  Printer,
  MapPin,
  Phone,
  User
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  delivery_fee?: number;
  delivery_address_id?: string;
  profiles?: { full_name: string | null; user_id: string };
  delivery_addresses?: {
    address_line: string;
    city?: string;
    phone_number?: string;
    map_link?: string;
  } | null;
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
  complete: { label: "Complete", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  return_requested: { label: "Return Requested", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("drive");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
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
      console.error("Status update error:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow popups for this site to print invoices");
      return;
    }

    const itemsTotal = order.order_items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const deliveryFee = order.delivery_fee || 5;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - #${order.id.slice(0, 8)}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { font-size: 28px; margin-bottom: 5px; }
          .header p { color: #666; }
          .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-info div { flex: 1; }
          .invoice-info h3 { font-size: 14px; color: #666; margin-bottom: 8px; }
          .invoice-info p { font-size: 14px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f8f8; font-weight: 600; }
          .text-right { text-align: right; }
          .totals { margin-left: auto; width: 300px; }
          .totals div { display: flex; justify-content: space-between; padding: 8px 0; }
          .totals .total { border-top: 2px solid #333; font-weight: bold; font-size: 18px; margin-top: 10px; padding-top: 10px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: #e3f2fd; color: #1976d2; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <p>Order #${order.id.slice(0, 8).toUpperCase()}</p>
        </div>
        
        <div class="invoice-info">
          <div>
            <h3>BILL TO</h3>
            <p><strong>${order.profiles?.full_name || 'Guest Customer'}</strong></p>
            <p>${order.delivery_addresses?.address_line || 'N/A'}</p>
            <p>${order.delivery_addresses?.city || ''}</p>
            <p>${order.delivery_addresses?.phone_number || 'N/A'}</p>
          </div>
          <div style="text-align: right;">
            <h3>INVOICE DETAILS</h3>
            <p><strong>Date:</strong> ${format(new Date(order.created_at), "MMM dd, yyyy")}</p>
            <p><strong>Status:</strong> <span class="status">${statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}</span></p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.order_items?.map(item => `
              <tr>
                <td>${item.product_name}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">$${item.price.toFixed(2)}</td>
                <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('') || '<tr><td colspan="4">No items</td></tr>'}
          </tbody>
        </table>
        
        <div class="totals">
          <div>
            <span>Subtotal</span>
            <span>$${itemsTotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Delivery Fee</span>
            <span>$${deliveryFee.toFixed(2)}</span>
          </div>
          <div class="total">
            <span>Total</span>
            <span>$${order.total_amount.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for your order!</p>
          <p>Generated on ${format(new Date(), "MMMM dd, yyyy 'at' HH:mm")}</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
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
    complete: orders.filter(o => o.status === "complete").length,
    monitoring: orders.filter(o => ["pending", "confirmed", "shipping"].includes(o.status)).length,
    return: orders.filter(o => o.status === "return_requested").length,
  };

  const OrdersTable = ({ 
    filteredOrders, 
    showActions = true,
    tabContext = "drive" 
  }: { 
    filteredOrders: Order[], 
    showActions?: boolean,
    tabContext?: string 
  }) => {
    const getContextualActions = (order: Order) => {
      switch (tabContext) {
        case "new":
          return (
            <>
              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                <Eye className="h-4 w-4 mr-2" />
                Review Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintInvoice(order)}>
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate(order.id, "confirmed")}
                className="text-green-600"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm Order
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate(order.id, "cancelled")}
                className="text-red-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reject Order
              </DropdownMenuItem>
            </>
          );
        case "confirmed":
          return (
            <>
              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintInvoice(order)}>
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate(order.id, "shipping")}
                className="text-purple-600"
              >
                <Truck className="h-4 w-4 mr-2" />
                Start Shipping
              </DropdownMenuItem>
            </>
          );
        case "shipping":
          return (
            <>
              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintInvoice(order)}>
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate(order.id, "delivered")}
                className="text-green-600"
              >
                <Package className="h-4 w-4 mr-2" />
                Mark as Delivered
              </DropdownMenuItem>
            </>
          );
        case "delivered":
          return (
            <>
              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintInvoice(order)}>
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate(order.id, "complete")}
                className="text-emerald-600"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Complete
              </DropdownMenuItem>
            </>
          );
        default:
          return (
            <>
              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintInvoice(order)}>
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
              {order.status === "delivered" && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "complete")}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Complete
                </DropdownMenuItem>
              )}
            </>
          );
      }
    };

    return (
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
                          {getContextualActions(order)}
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
  };

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
      {/* Order Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order #{selectedOrder?.id.slice(0, 8)}
              {selectedOrder && (
                <Badge 
                  variant="outline" 
                  className={statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color || ""}
                >
                  {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || selectedOrder.status}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder && format(new Date(selectedOrder.created_at), "MMMM dd, yyyy 'at' HH:mm")}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{selectedOrder.profiles?.full_name || "Guest"}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-sm">{selectedOrder.delivery_addresses?.address_line || "N/A"}</p>
                    {selectedOrder.delivery_addresses?.city && (
                      <p className="text-sm text-muted-foreground">{selectedOrder.delivery_addresses.city}</p>
                    )}
                    {selectedOrder.delivery_addresses?.phone_number && (
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedOrder.delivery_addresses.phone_number}
                      </p>
                    )}
                    {selectedOrder.delivery_addresses?.map_link && (
                      <a 
                        href={selectedOrder.delivery_addresses.map_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View on Map
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  {(!selectedOrder.order_items || selectedOrder.order_items.length === 0) && (
                    <p className="text-muted-foreground text-center py-4">No items in this order</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${((selectedOrder.total_amount || 0) - (selectedOrder.delivery_fee || 5)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>${(selectedOrder.delivery_fee || 5).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => handlePrintInvoice(selectedOrder)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Invoice
                </Button>
                {selectedOrder.status === "pending" && (
                  <Button onClick={() => { handleStatusUpdate(selectedOrder.id, "confirmed"); setDetailDialogOpen(false); }}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Confirm Order
                  </Button>
                )}
                {selectedOrder.status === "confirmed" && (
                  <Button onClick={() => { handleStatusUpdate(selectedOrder.id, "shipping"); setDetailDialogOpen(false); }}>
                    <Truck className="h-4 w-4 mr-2" />
                    Mark as Shipping
                  </Button>
                )}
                {selectedOrder.status === "shipping" && (
                  <Button onClick={() => { handleStatusUpdate(selectedOrder.id, "delivered"); setDetailDialogOpen(false); }}>
                    <Package className="h-4 w-4 mr-2" />
                    Mark as Delivered
                  </Button>
                )}
                {selectedOrder.status === "delivered" && (
                  <Button onClick={() => { handleStatusUpdate(selectedOrder.id, "complete"); setDetailDialogOpen(false); }}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
              <CardDescription>Review order details and confirm or reject orders</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={filterOrdersByStatus(["pending"])} tabContext="new" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Confirmed Orders Tab */}
        <TabsContent value="confirmed" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Confirmed Orders</CardTitle>
              <CardDescription>Manage orders ready for shipping</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={filterOrdersByStatus(["confirmed"])} tabContext="confirmed" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Orders Tab */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Shipping List</CardTitle>
              <CardDescription>Track orders in transit and manage deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={filterOrdersByStatus(["shipping"])} tabContext="shipping" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivered Orders Tab */}
        <TabsContent value="delivered" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Delivered Orders</CardTitle>
              <CardDescription>Verify completed deliveries and mark orders as complete</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <OrdersTable filteredOrders={filterOrdersByStatus(["delivered"])} tabContext="delivered" />
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
              <CardDescription>Orders with return requests from customers</CardDescription>
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
