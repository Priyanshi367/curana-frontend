import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, ArrowRight } from "lucide-react";

const applications = [
  { name: "Microsoft Teams", logo: "https://curana-connect-portal.lovable.app/assets/teams-logo-DiIuOZ_J.png", url: "#" },
  { name: "Outlook", logo: "https://curana-connect-portal.lovable.app/assets/outlook-logo-BRrJb0Yz.png", url: "#" },
  { name: "Workday", logo: "https://curana-connect-portal.lovable.app/assets/workday-logo-COSMSvye.png", url: "#" },
  { name: "Epic EHR", logo: "https://curana-connect-portal.lovable.app/assets/epic-logo-B93Nntu1.png", url: "#" },
  { name: "UpToDate", logo: "https://curana-connect-portal.lovable.app/assets/uptodate-logo-pzGTh8d9.png", url: "#" },
  { name: "Navan Travel", logo: "https://curana-connect-portal.lovable.app/assets/navan-logo-EGLO0z0q.png", url: "#" },
  { name: "PerkSpot", logo: "https://curana-connect-portal.lovable.app/assets/perkspot-logo-CVtjcnAa.png", url: "#" },
  { name: "HR Connect", logo: "https://curana-connect-portal.lovable.app/assets/hrconnect-logo-Clze083M.png", url: "#" },
  { name: "Finance Tracker", logo: "https://curana-connect-portal.lovable.app/assets/finance-logo-C0bSVVWM.png", url: "#" },
  { name: "Compliance Portal", logo: "https://curana-connect-portal.lovable.app/assets/compliance-logo-CUCUm5LO.png", url: "#" },
  { name: "Learning Hub", logo: "https://curana-connect-portal.lovable.app/assets/learning-logo-C7fWowZc.png", url: "#" },
  { name: "Support Desk", logo: "https://curana-connect-portal.lovable.app/assets/support-logo-CAyeo7Fd.png", url: "#" },
];

const ApplicationsGrid = () => {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">My Applications</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:font-semibold hover:text-white text-xs sm:text-sm">
          View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {applications.map((app) => (
          <a
            key={app.name}
            href={app.url}
            className="block group"
          >
            <div className="p-3 sm:p-4 hover:bg-accent/5 rounded-lg transition-all text-center h-24 sm:h-28 flex flex-col items-center justify-center">
              <img src={app.logo} alt={app.name} className="h-8 w-8 sm:h-10 sm:w-10 object-contain mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-foreground line-clamp-2">{app.name}</p>
            </div>
          </a>
        ))}
        
        {/* Add More Apps */}
        <div className="p-3 sm:p-4 border border-dashed border-border hover:bg-accent/5 rounded-lg transition-all text-center h-24 sm:h-28 flex flex-col items-center justify-center cursor-pointer group">
          <Plus className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground group-hover:text-accent mb-2" />
          <p className="text-xs font-medium text-muted-foreground group-hover:text-accent">Add More</p>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationsGrid;
