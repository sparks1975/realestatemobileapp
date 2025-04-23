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
  const { theme, setTheme } = useTheme();
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
  
  const handleThemeChange = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };
  
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
            >
              <svg 
                className="w-4 h-4 inline mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
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
              <div 
                className="text-xs text-muted-foreground cursor-pointer"
                onClick={handleThemeChange}
              >
                {theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}
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
