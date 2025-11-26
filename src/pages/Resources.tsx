import DashboardLayout from "@/components/DashboardLayout";
import PageBanner from "@/components/PageBanner";
import { Card } from "@/components/ui/card";
import { FolderOpen, FileText, Download, Heart, Settings, UserSquare2, Briefcase, CreditCard, Ticket, Gift, MapPin, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import bannerImg from "@/assets/banner-resources.jpg";

const quickLinks = [
  { name: "Benefits", icon: Heart, color: "#8b5cf6" },
  { name: "Contract Support Request Hub", icon: FileText, color: "#6366f1" },
  { name: "Curana Store", icon: Gift, color: "#ec4899" },
  { name: "Events", icon: Ticket, color: "#0ea5e9" },
  { name: "Marketing Hub", icon: Settings, color: "#f59e0b" },
  { name: "Navan", icon: MapPin, color: "#14b8a6" },
  { name: "Perkspot", icon: CreditCard, color: "#f43f5e" },
  { name: "Policies", icon: FileText, color: "#84cc16" },
  { name: "UpToDate", icon: Stethoscope, color: "#06b6d4" },
  { name: "Workday", icon: Briefcase, color: "#3b82f6" },
];

const resources = [
  { name: "Employee Handbook 2025", type: "PDF", size: "2.4 MB", modified: "2025-01-15" },
  { name: "Benefits Overview", type: "PDF", size: "1.8 MB", modified: "2025-01-10" },
  { name: "Clinical Protocols", type: "Folder", items: "24 files", modified: "2025-01-12" },
  { name: "Training Materials", type: "Folder", items: "15 files", modified: "2024-12-20" },
  { name: "IT Security Guidelines", type: "PDF", size: "1.2 MB", modified: "2025-01-08" },
  { name: "Patient Care Standards", type: "PDF", size: "3.1 MB", modified: "2025-01-05" },
];

const Resources = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <PageBanner title="My Resources" backgroundImage={bannerImg} />

        {/* Quick Links Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Card
                  key={link.name}
                  className="p-4 hover:shadow-hover transition-all cursor-pointer group"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${link.color}15` }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: link.color }} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{link.name}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Documents */}
        {/* <div>
          <h2 className="text-2xl font-semibold mb-6">Documents & Files</h2>
          <div className="space-y-4">
            {resources.map((resource) => (
              <Card key={resource.name} className="p-6 hover:shadow-hover transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      {resource.type === "Folder" ? (
                        <FolderOpen className="h-6 w-6 text-violet-500" />
                      ) : (
                        <FileText className="h-6 w-6 text-violet-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {resource.type === "Folder" ? resource.items : `${resource.type} • ${resource.size}`} • Modified {resource.modified}
                      </p>
                    </div>
                  </div>
                  {resource.type !== "Folder" && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default Resources;
