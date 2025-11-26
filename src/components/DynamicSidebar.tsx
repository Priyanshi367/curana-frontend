import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useSidebar } from '@/contexts/SidebarContext';
import { useLayout } from '@/contexts/LayoutContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import profileImg from '@/assets/profile-avatar.jpg';
import { useDynamicMenu } from '@/hooks/useDynamicMenu';
import { MenuItem } from '@/types/menu';
import { getIconComponent } from '@/utils/iconMapping';
import { getStoredUser } from '@/services/auth';

const DynamicSidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { toggleLayout } = useLayout();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { menuItems, loading, error } = useDynamicMenu();
  const user = getStoredUser();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-vertical-sidebar-root]')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const renderMenuItem = (item: MenuItem) => {
    const IconComponent = getIconComponent(item.icon);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openDropdown === item.documentId;

    if (!hasChildren) {
      return (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            <NavLink
              to={item.url}
              className={`flex items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                isCollapsed
                  ? 'justify-center p-0'
                  : 'gap-3 px-4 py-2.5 hover:bg-accent/10'
              }`}
              activeClassName={isCollapsed ? '' : 'bg-primary/10 text-primary font-medium'}
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex items-center justify-center rounded-full transition-all duration-200 relative ${
                      isCollapsed
                        ? `h-9 w-9 ${
                            isActive
                              ? 'bg-primary ring-2 ring-primary scale-105'
                              : 'bg-gray-200 hover:scale-105'
                          }`
                        : ''
                    }`}
                  >
                    <IconComponent
                      className={`h-5 w-5 ${
                        isCollapsed
                          ? isActive
                            ? 'text-primary-foreground'
                            : 'text-gray-600'
                          : isActive
                          ? 'text-primary'
                          : 'text-sidebar-foreground'
                      }`}
                    />
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm text-sidebar-foreground">{item.title}</span>
                  )}
                </>
              )}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2 z-[100]" hidden={!isCollapsed}>
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    // With children
    return (
      <div key={item.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setOpenDropdown(isOpen ? null : item.documentId)}
              className={`w-full flex items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                isCollapsed
                  ? 'justify-center p-0'
                  : 'gap-3 px-4 py-2.5 hover:bg-primary/10'
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-200 relative ${
                  isCollapsed ? 'h-9 w-9 bg-gray-200' : ''
                }`}
              >
                <IconComponent
                  className={`h-5 w-5 ${
                    isCollapsed ? 'text-gray-600' : 'text-sidebar-foreground'
                  }`}
                />
              </div>
              {!isCollapsed && (
                <>
                  <span className="text-sm text-sidebar-foreground flex-1 text-left">
                    {item.title}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2 z-[100] p-0" hidden={!isCollapsed}>
            <div className="w-56 p-2">
              <div className="px-2 py-1.5 text-sm font-medium text-foreground">
                {item.title}
              </div>
              <div className="mt-1 space-y-1">
                {item.children?.map((child) => {
                  const ChildIcon = getIconComponent(child.icon);
                  return (
                    <NavLink
                      key={child.id}
                      to={child.url}
                      className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <ChildIcon className="h-4 w-4" />
                      {child.title}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Submenu (expanded mode only) */}
        {!isCollapsed && isOpen && (
          <div className="mt-1 ml-12 space-y-1">
            {item.children?.map((child) => {
              const ChildIcon = getIconComponent(child.icon);
              return (
                <NavLink
                  key={child.id}
                  to={child.url}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                  activeClassName="bg-primary/10 text-primary font-medium"
                  onClick={() => setOpenDropdown(null)}
                >
                  <ChildIcon className="h-4 w-4" />
                  {child.title}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed left-0 md:left-2 top-[70px] md:top-[86px] bottom-0 md:bottom-4 bg-sidebar md:rounded-[35px] shadow-elegant transition-all duration-300 flex flex-col overflow-hidden z-50 ${
          isCollapsed
            ? 'w-0 md:w-[60px] -translate-x-full md:translate-x-0'
            : 'w-[280px]'
        }`}
        data-vertical-sidebar-root
      >
        {/* Profile Section at Top */}
        <div
          className={`flex items-center gap-3 py-4 ${
            isCollapsed ? 'justify-center px-2' : 'px-4'
          }`}
        >
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
            <img src={profileImg} alt="Profile" className="h-full w-full object-cover" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-sidebar-foreground">
                {user?.username || user?.email || 'User'}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role?.name || 'User'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-3 px-2 py-2 overflow-y-auto">
          {loading && !isCollapsed && (
            <div className="px-4 py-2 text-sm text-muted-foreground">Loading menu...</div>
          )}
          
          {error && !isCollapsed && (
            <div className="px-4 py-2 text-sm text-red-500">Error: {error}</div>
          )}

          {!loading && !error && (
            <TooltipProvider delayDuration={100}>
              {menuItems.map((item) => renderMenuItem(item))}
            </TooltipProvider>
          )}
        </nav>

        {/* Layout Toggle Button */}
        {/* <div className="p-2 border-t border-border/30 space-y-1">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleLayout}
                  className={`w-full flex items-center justify-center rounded-lg p-2.5 transition-colors hover:bg-primary/10 ${
                    isCollapsed ? 'justify-center' : 'justify-start gap-3'
                  }`}
                  title="Switch to horizontal layout"
                >
                  <svg
                    className="h-5 w-5 text-sidebar-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {!isCollapsed && (
                    <span className="text-sm font-medium text-sidebar-foreground">
                      Horizontal Layout
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="ml-2 z-[100]">
                  <p>Switch to horizontal layout</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div> */}
      </aside>
    </>
  );
};

export default DynamicSidebar;
