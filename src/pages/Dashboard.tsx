import DashboardLayout from "@/components/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import QuickLinks from "@/components/dashboard/QuickLinks";
import NewsBlock from "@/components/dashboard/NewsBlock";
import EventsBlock from "@/components/dashboard/EventsBlock";
import ApplicationsGrid from "@/components/dashboard/ApplicationsGrid";
import EssentialTools from "@/components/dashboard/EssentialTools";
import MyWorkspace from "@/components/dashboard/MyWorkspace";
import AnnouncementBlock from "@/components/dashboard/AnnouncementBlock";
import MyTeam from "@/components/dashboard/MyTeam";
import MyFiles from "@/components/dashboard/MyFiles";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto px-4 space-y-6 mt-5">
        <WelcomeBanner />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch auto-rows-auto">
          <div className="lg:col-span-1 xl:col-span-2 h-full lg:min-h-[380px]">
            <NewsBlock />
          </div>
          <div className="lg:col-span-1 xl:col-span-1 h-full lg:min-h-[380px]">
            <EventsBlock />
          </div>
           <div className="lg:col-span-2">
            <ApplicationsGrid />
          </div>
          <div className="lg:col-span-1">
            <QuickLinks />

          </div>
         
          {/* <div className="lg:col-span-1 md:col-span-1">
            <AnnouncementBlock />
          </div> */}
          <MyFiles />

          <EssentialTools />

          <MyWorkspace />
          <MyTeam />
        </div>
      </div>
    </DashboardLayout>


  );
};

export default Dashboard;
