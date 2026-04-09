import {
  LayoutDashboard, Package, PlusCircle, MessageCircle, ClipboardList,
  User, MapPin, Settings, Star, TrendingUp, Bell, HelpCircle,
  CreditCard, Users, Tag, BarChart3, Share2, Shield, FileText, LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";

const mainItems = [
  { title: "Dashboard", url: "/seller", icon: LayoutDashboard },
  { title: "My Products", url: "/seller/products", icon: Package },
  { title: "Add Product", url: "/seller/products/new", icon: PlusCircle },
  { title: "Orders", url: "/seller/orders", icon: ClipboardList },
  { title: "Chat", url: "/seller/chat", icon: MessageCircle },
];

const businessItems = [
  { title: "Analytics", url: "/seller/analytics", icon: BarChart3 },
  { title: "Revenue", url: "/seller/revenue", icon: TrendingUp },
  { title: "Customers", url: "/seller/customers", icon: Users },
  { title: "Offers & Deals", url: "/seller/offers", icon: Tag },
  { title: "Reviews", url: "/seller/reviews", icon: Star },
  { title: "Promotions", url: "/seller/promotions", icon: Share2 },
];

const settingsItems = [
  { title: "Profile", url: "/seller/profile", icon: User },
  { title: "Location", url: "/seller/location", icon: MapPin },
  { title: "Notifications", url: "/seller/notifications", icon: Bell },
  { title: "Payments", url: "/seller/payments", icon: CreditCard },
  { title: "Security", url: "/seller/security", icon: Shield },
  { title: "Policies", url: "/seller/policies", icon: FileText },
  { title: "Settings", url: "/seller/settings", icon: Settings },
  { title: "Help & Support", url: "/seller/help", icon: HelpCircle },
];

export function SellerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end={item.url === "/seller"} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-2">
        <img src={logo} alt="CapeCart" className="w-8 h-8 rounded-lg shrink-0" />
        {!collapsed && (
          <div>
            <p className="font-heading font-bold text-sm">CapeCart</p>
            <p className="text-[10px] text-muted-foreground">Seller Dashboard</p>
          </div>
        )}
      </div>
      <SidebarContent>
        {renderGroup("Main", mainItems)}
        {renderGroup("Business", businessItems)}
        {renderGroup("Settings", settingsItems)}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <button onClick={() => signOut()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full">
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
