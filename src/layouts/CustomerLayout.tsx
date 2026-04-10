import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/components/CustomerSidebar";
import { Bell, ShoppingCart } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import logo from "@/assets/logo.png";

const CustomerLayout = () => {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CustomerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="md:hidden flex items-center gap-2">
                <img src={logo} alt="CapeCart" className="w-7 h-7 rounded-lg" />
                <span className="font-heading font-bold text-sm">CapeCart</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/customer/cart")} className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              </button>
              <button onClick={() => navigate("/customer/notifications")} className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-destructive rounded-full flex items-center justify-center text-[10px] text-destructive-foreground font-bold px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerLayout;
