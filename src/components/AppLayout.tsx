import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border bg-card/50 backdrop-blur-sm px-2 z-20 md:hidden">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <span className="ml-3 text-sm font-semibold text-foreground">
              Tech-<span className="text-primary">Fiber</span>
            </span>
          </header>
          <main className="flex-1 relative">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
