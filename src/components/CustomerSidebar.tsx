import {
  LayoutDashboard, Search, ShoppingCart, Heart, MessageCircle,
  ClipboardList, User, MapPin, Bell, Settings, HelpCircle,
  Star, Tag, Clock, CreditCard, Shield, Bookmark, Gift, LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar
} from "@/components/ui/sidebar";
import { ShoppingBag } from "lucide-react";

const mainItems = [
  { title: "Home", url: "/customer", icon: LayoutDashboard },
  { title: "Search", url: "/customer/search", icon: Search },
  { title: "Categories", url: "/customer/categories", icon: Tag },
  { title: "Cart", url: "/customer/cart", icon: ShoppingCart },
  { title: "Orders", url: "/customer/orders", icon: ClipboardList },
  { title: "Chat", url: "/customer/chat", icon: MessageCircle },
];

const shopItems = [
  { title: "Wishlist", url: "/customer/wishlist", icon: Heart },
  { title: "Saved Items", url: "/customer/saved", icon: Bookmark },
  { title: "Deals & Offers", url: "/customer/deals", icon: Gift },
  { title: "Recently Viewed", url: "/customer/recent", icon: Clock },
  { title: "My Reviews", url: "/customer/reviews", icon: Star },
];

const settingsItems = [
  { title: "Profile", url: "/customer/profile", icon: User },
  { title: "Addresses", url: "/customer/addresses", icon: MapPin },
  { title: "Notifications", url: "/customer/notifications", icon: Bell },
  { title: "Payments", url: "/customer/payments", icon: CreditCard },
  { title: "Security", url: "/customer/security", icon: Shield },
  { title: "Settings", url: "/customer/settings", icon: Settings },
  { title: "Help & Support", url: "/customer/help", icon: HelpCircle },
];

export function CustomerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/customer"}
                  className="hover:bg-sidebar-accent/50"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                >
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
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-heading font-bold text-sm">CapeCart</p>
            <p className="text-[10px] text-muted-foreground">Shopping</p>
          </div>
        )}
      </div>
      <SidebarContent>
        {renderGroup("Main", mainItems)}
        {renderGroup("Shopping", shopItems)}
        {renderGroup("Account", settingsItems)}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
