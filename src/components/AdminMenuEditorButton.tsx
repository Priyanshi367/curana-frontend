import { Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AdminMenuEditorButtonProps {
  onClick: () => void;
  isCollapsed: boolean;
}

export function AdminMenuEditorButton({ onClick, isCollapsed }: AdminMenuEditorButtonProps) {
  return (
    <div className="p-2 border-t border-border/30">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onClick}
              className={`w-full flex items-center justify-center rounded-lg p-2.5 transition-colors hover:bg-primary/10 ${
                isCollapsed ? 'justify-center' : 'justify-start gap-3'
              }`}
              title="Edit menu order"
            >
              <Settings className="h-5 w-5 text-sidebar-foreground" />
              {!isCollapsed && (
                <span className="text-sm font-medium text-sidebar-foreground">
                  Edit Menu
                </span>
              )}
            </button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="ml-2 z-[100]">
              <p>Edit menu order</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
