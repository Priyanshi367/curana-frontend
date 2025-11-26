import { Search, Bell, Menu, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/contexts/SidebarContext";
import { ThemePicker } from "@/components/ThemePicker";
import logo from "@/assets/logonew.png";
import profileImg from "@/assets/profile-avatar.jpg";
import { logout, getStoredUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const user = getStoredUser();

  return (
    <header className="fixed top-0 left-0 right-0 h-12 sm:h-14 text-header-foreground z-50 shadow-elegant" style={{ background: 'var(--header-gradient)' }}>
      <div className="h-full flex items-center justify-between px-2 sm:px-4 gap-2 sm:gap-4">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 sm:h-9 sm:w-9 text-header-foreground hover:bg-white/10"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <img src={logo} alt="Curana Hub" className="h-12 sm:h-12 w-auto" />
        </div>

        {/* Center: Search - Hidden on mobile, visible on md+ */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search... (Ctrl+K)"
            className="w-full h-9 pl-9 pr-3 bg-white/10 border-white/20 text-header-foreground placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 rounded-full transition-all text-sm"
          />
        </div>

        {/* Search button on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 text-header-foreground hover:bg-white/10"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 text-header-foreground hover:bg-white/10 relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full" />
          </Button>

          {/* Theme Picker */}
          <ThemePicker />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full overflow-hidden border border-white/30 group-hover:border-white/50 transition-colors">
                  <img
                    src={profileImg}
                    alt={'User'}
                    className="h-full w-full object-cover"
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-header-foreground/80 group-hover:text-header-foreground transition-colors" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 mt-2" 
              align="end"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
