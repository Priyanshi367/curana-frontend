import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import React from "react";

interface AppCardProps {
  app: {
    name: string;
    description: string;
    image: string;
    popular?: boolean;
  };
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  if (!app) return null;
  
  return (
    <Card
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01] h-full flex flex-col"
      role="button"
      tabIndex={0}
      aria-label={`${app.name} - ${app.description}`}>
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/90 z-10 rounded-t-xl" />

      {app.popular && (
        <span className="absolute top-3 right-3 z-20 text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-medium flex items-center gap-1 shadow-md shadow-amber-100 animate-pulse">
          <Sparkles className="w-3 h-3" /> Popular
        </span>
      )}

      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="w-full h-40 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 border-b border-border/20 transition-all duration-300 group-hover:from-muted/40 group-hover:to-muted/20">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-36 h-36 rounded-full bg-primary/10 blur-2xl opacity-60 transform transition-transform duration-300 group-hover:scale-110" />
          </div>
          <img 
            src={app.image} 
            alt={app.name} 
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" 
            loading="lazy" 
          />
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-200">
              {app.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {app.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppCard;
