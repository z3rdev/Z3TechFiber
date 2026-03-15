import {
  Wifi, Map, LayoutDashboard, BarChart3, Settings, Info,
  Wrench, LogOut, Search, Hexagon
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useCTOSearch } from "@/contexts/CTOSearchContext";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Mapa", url: "/", icon: Map },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Métricas", url: "/metrics", icon: BarChart3 },
];

const systemItems = [
  { title: "Configurações", url: "/settings", icon: Settings },
  { title: "Ferramentas", url: "/tools", icon: Wrench },
  { title: "Sobre", url: "/about", icon: Info },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery, searchResults, selectCTO } = useCTOSearch();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Wifi className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Tech-Fiber
            </span>
          )}
        </div>
        {!collapsed && (
          <div className="mt-3 relative">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar CTO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 bg-secondary/50 border-border text-xs"
              />
            </div>
            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((cto) => {
                  const losCount = cto.clients.filter((c) => c.status === "los").length;
                  return (
                    <button
                      key={cto.id}
                      onClick={() => selectCTO(cto)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-secondary/70 transition-colors text-left"
                    >
                      <Hexagon className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{cto.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {cto.id} · {cto.clients.length}/{cto.totalPorts} portas
                          {losCount > 0 && <span className="text-destructive ml-1">· {losCount} LOS</span>}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 px-3 py-2">
                <p className="text-xs text-muted-foreground">Nenhuma CTO encontrada</p>
              </div>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-medium px-2 mb-1">
            Painel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-secondary/70 rounded-md transition-colors text-sm"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="w-4 h-4 mr-2.5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-medium px-2 mb-1">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-secondary/70 rounded-md transition-colors text-sm"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="w-4 h-4 mr-2.5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Legenda do Mapa */}
        {!collapsed && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-medium px-2 mb-1">
              Legenda
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-high-signal flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">&gt;80% ocupada</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-los flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Com LOS</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 mb-2 px-1">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-semibold">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors text-sm"
            >
              <LogOut className="w-4 h-4 mr-2.5" />
              {!collapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
