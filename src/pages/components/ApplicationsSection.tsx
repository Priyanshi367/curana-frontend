import { Stethoscope, Users } from "lucide-react";
import React from "react";
import AppCard from "./AppCard";

interface App {
  name: string;
  description: string;
  image: string;
  popular?: boolean;
}

interface ApplicationsSectionProps {
  title: string;
  description: string;
  apps: App[];
  icon: React.ReactNode;
}

const ApplicationsSection: React.FC<ApplicationsSectionProps> = ({
  title,
  description,
  apps,
  icon,
}) => {
  return (
    <section className="mb-8 last:mb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            {<Stethoscope className="h-4 w-4 text-primary" />}
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {description && (
          <div className="text-sm text-muted-foreground">
            {description}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
        {apps.map((app) => (
          <AppCard key={app.name} app={app} />
        ))}
      </div>
    </section>
  );
};

export default ApplicationsSection;
