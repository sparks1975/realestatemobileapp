import { useQuery } from "@tanstack/react-query";
import { 
  Bell, Home, FilePenLine, BanknoteIcon, UserPlus, 
  BarChart3, Users, MessageSquare, MousePointerClick 
} from "lucide-react";
import PortfolioChart from "@/components/charts/PortfolioChart";
import KpiCard from "@/components/ui/kpi-card";
import AppointmentCard from "@/components/ui/appointment-card";
import ActivityItem from "@/components/ui/activity-item";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  portfolioValue, portfolioValueChange, 
  financialStatistics, websiteStatistics, 
  activities, appointments, clients 
} from "@/lib/mock-data";

export default function Dashboard() {
  // Fetch dashboard data
  const { data, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    queryFn: async () => {
      // For demo purposes, use mock data
      // In a real app, this would fetch from the API
      return {
        portfolioValue,
        percentChange: portfolioValueChange,
        financialStatistics,
        websiteStatistics,
        activities,
        todayAppointments: appointments.filter(
          appt => new Date(appt.date).toDateString() === new Date().toDateString()
        )
      };
    }
  });
  
  // Find clients for appointments
  const getClientForAppointment = (clientId?: number | null) => {
    if (!clientId) return undefined;
    return clients.find(client => client.id === clientId);
  };
  
  return (
    <div className="px-4 pt-12 pb-6">
      {/* Header with greeting and notification */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Alex Morgan</h1>
          <p className="text-muted-foreground text-sm">Premium Realtor</p>
        </div>
        <button className="relative p-2 bg-muted dark:bg-card rounded-full">
          <Bell className="text-muted-foreground" size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
      </div>
      
      {/* Portfolio Value Chart */}
      {isLoading ? (
        <div className="h-40 bg-muted animate-pulse rounded-xl mb-6"></div>
      ) : (
        <PortfolioChart 
          value={data?.portfolioValue || 0} 
          percentChange={data?.percentChange || 0} 
        />
      )}
      
      {/* Analytics Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="financial" className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-2 bg-muted rounded-full p-1">
            <TabsTrigger 
              value="financial" 
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Financial
            </TabsTrigger>
            <TabsTrigger 
              value="website" 
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Website
            </TabsTrigger>
          </TabsList>
          
          {/* Financial Stats Tab */}
          <TabsContent value="financial" className="mt-0">
            <div className="grid grid-cols-2 gap-4">
              <KpiCard 
                title="Active Listings"
                value={data?.financialStatistics.activeListings || financialStatistics.activeListings}
                change={data?.financialStatistics.activeListingsChange || financialStatistics.activeListingsChange}
                icon={Home}
                iconColor="text-primary"
              />
              
              <KpiCard 
                title="Pending Sales"
                value={data?.financialStatistics.pendingSales || financialStatistics.pendingSales}
                change={data?.financialStatistics.pendingSalesChange || financialStatistics.pendingSalesChange}
                icon={FilePenLine}
                iconColor="text-secondary"
              />
              
              <KpiCard 
                title="Closed Sales"
                value={data?.financialStatistics.closedSales || financialStatistics.closedSales}
                change={data?.financialStatistics.closedSalesChange || financialStatistics.closedSalesChange}
                icon={BanknoteIcon}
                iconColor="text-[#FF6B6B]"
              />
              
              <KpiCard 
                title="New Leads"
                value={data?.financialStatistics.newLeads || financialStatistics.newLeads}
                change={data?.financialStatistics.newLeadsChange || financialStatistics.newLeadsChange}
                icon={UserPlus}
                iconColor="text-[#FFB830]"
                changePeriod="this week"
              />
            </div>
          </TabsContent>
          
          {/* Website Stats Tab */}
          <TabsContent value="website" className="mt-0">
            <div className="grid grid-cols-2 gap-4">
              <KpiCard 
                title="Page Views"
                value={data?.websiteStatistics.pageViews || websiteStatistics.pageViews}
                change={data?.websiteStatistics.pageViewsChange || websiteStatistics.pageViewsChange}
                icon={BarChart3}
                iconColor="text-primary"
              />
              
              <KpiCard 
                title="Visitors"
                value={data?.websiteStatistics.visitors || websiteStatistics.visitors}
                change={data?.websiteStatistics.visitorsChange || websiteStatistics.visitorsChange}
                icon={Users}
                iconColor="text-secondary"
              />
              
              <KpiCard 
                title="Inquiries"
                value={data?.websiteStatistics.inquiries || websiteStatistics.inquiries}
                change={data?.websiteStatistics.inquiriesChange || websiteStatistics.inquiriesChange}
                icon={MessageSquare}
                iconColor="text-[#FF6B6B]"
              />
              
              <KpiCard 
                title="Bounce Rate"
                value={data?.websiteStatistics.bounceRate || websiteStatistics.bounceRate}
                change={data?.websiteStatistics.bounceRateChange || websiteStatistics.bounceRateChange}
                icon={MousePointerClick}
                iconColor="text-[#FFB830]"
                changePeriod="this month"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Today's Appointments */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Today's Appointments</h2>
          <button className="text-primary text-sm font-medium">View All</button>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-20 bg-muted animate-pulse rounded-xl"></div>
            <div className="h-20 bg-muted animate-pulse rounded-xl"></div>
          </div>
        ) : data?.todayAppointments && data.todayAppointments.length > 0 ? (
          <div>
            {data.todayAppointments.map(appointment => (
              <AppointmentCard 
                key={appointment.id}
                appointment={appointment}
                client={getClientForAppointment(appointment.clientId)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-card rounded-xl">
            <p className="text-muted-foreground">No appointments for today</p>
          </div>
        )}
      </div>
      
      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Recent Activity</h2>
          <button className="text-primary text-sm font-medium">View All</button>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-20 bg-muted animate-pulse rounded-xl"></div>
            <div className="h-20 bg-muted animate-pulse rounded-xl"></div>
            <div className="h-20 bg-muted animate-pulse rounded-xl"></div>
          </div>
        ) : data?.activities && data.activities.length > 0 ? (
          <div>
            {data.activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-card rounded-xl">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}