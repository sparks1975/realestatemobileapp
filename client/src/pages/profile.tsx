import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  User, Bell, Globe, Moon, ChevronRight, 
  LogOut, Lock, CreditCard, CircleHelp, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { currentUser } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function Profile() {
  const { theme } = useTheme(); // Keep for type compatibility
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Fetch user data
  const { data, isLoading } = useQuery({
    queryKey: ["/api/users/me"],
    queryFn: async () => {
      // For demo purposes, use mock data
      return currentUser;
    }
  });
  
  // Stats data
  const stats = [
    { label: "Listings", value: 24 },
    { label: "Closed", value: 15 },
    { label: "Clients", value: 38 }
  ];
  
  return (
    <div className="px-4 pt-12 pb-6">
      {/* Profile Header */}
      {isLoading ? (
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-muted animate-pulse mb-4"></div>
          <div className="h-7 bg-muted animate-pulse rounded mb-1 w-1/3"></div>
          <div className="h-5 bg-muted animate-pulse rounded mb-2 w-1/4"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary">
            <img 
              src={data?.profileImage} 
              alt={data?.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">{data?.name}</h1>
          <p className="text-muted-foreground text-sm">Premium Realtor</p>
          <div className="flex mt-2">
            <motion.button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm mr-2 shadow-glow-primary"
              whileTap={{ scale: 0.95 }}
            >
              Edit Profile
            </motion.button>
            <motion.button 
              className="bg-card text-muted-foreground px-4 py-2 rounded-full text-sm shadow"
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('/', '_blank')}
            >
              <Globe className="w-4 h-4 inline mr-1" />
              Website
            </motion.button>
          </div>
        </div>
      )}
      
      {/* Profile Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-3 shadow text-center">
            <h2 className="text-2xl font-bold text-primary">{stat.value}</h2>
            <p className="text-muted-foreground text-xs">{stat.label}</p>
          </Card>
        ))}
      </div>
      
      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Account Section */}
        <div>
          <h2 className="text-lg font-bold mb-3">Account</h2>
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
                  <User className="text-primary text-sm" size={16} />
                </div>
                <span>Personal Information</span>
              </div>
              <ChevronRight className="text-muted-foreground text-sm" size={16} />
            </div>
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
                  <Lock className="text-primary text-sm" size={16} />
                </div>
                <span>Security</span>
              </div>
              <ChevronRight className="text-muted-foreground text-sm" size={16} />
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
                  <CreditCard className="text-primary text-sm" size={16} />
                </div>
                <span>Billing</span>
              </div>
              <ChevronRight className="text-muted-foreground text-sm" size={16} />
            </div>
          </Card>
        </div>
        
        {/* Preferences Section */}
        <div>
          <h2 className="text-lg font-bold mb-3">Preferences</h2>
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center mr-3">
                  <Bell className="text-secondary text-sm" size={16} />
                </div>
                <span>Notifications</span>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center mr-3">
                  <Globe className="text-secondary text-sm" size={16} />
                </div>
                <span>Language</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="mr-2">English</span>
                <ChevronRight className="text-sm" size={16} />
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center mr-3">
                  <Moon className="text-secondary text-sm" size={16} />
                </div>
                <span>Dark Mode</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Always On
              </div>
            </div>
          </Card>
        </div>
        
        {/* Help Section */}
        <div>
          <h2 className="text-lg font-bold mb-3">Help</h2>
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#FFB830] bg-opacity-10 flex items-center justify-center mr-3">
                  <CircleHelp className="text-[#FFB830] text-sm" size={16} />
                </div>
                <span>Help Center</span>
              </div>
              <ChevronRight className="text-muted-foreground text-sm" size={16} />
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#FFB830] bg-opacity-10 flex items-center justify-center mr-3">
                  <Info className="text-[#FFB830] text-sm" size={16} />
                </div>
                <span>About</span>
              </div>
              <ChevronRight className="text-muted-foreground text-sm" size={16} />
            </div>
          </Card>
        </div>
        
        {/* Logout Button */}
        <Button 
          variant="outline"
          className="w-full py-6 mt-4 flex items-center justify-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
