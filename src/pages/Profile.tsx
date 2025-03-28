
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  LogOut, 
  ChevronRight, 
  Bell, 
  CreditCard, 
  Heart, 
  History, 
  Award, 
  MessageCircle, 
  HelpCircle, 
  User,
  ChevronLeft,
  ChevronDown,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock user data
const userData = {
  name: 'Emma Wilson',
  email: 'emma.wilson@example.com',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  tier: 'Gold',
  preferences: {
    dietaryRestrictions: ['Gluten-free', 'Kiwi', 'Seed oils'],
    cookingTime: '20 mins',
    calories: 2200,
    cookingLevel: 'Medium'
  }
};

const profileSections = [
  {
    title: 'Account',
    items: [
      { icon: <User className="w-5 h-5" />, label: 'Personal Information', link: '/profile/personal' },
      { icon: <Target className="w-5 h-5" />, label: 'Goals', link: '/profile/goals' },
      { icon: <Bell className="w-5 h-5" />, label: 'Notifications', link: '/profile/notifications', rightElement: <Switch id="notifications" defaultChecked /> },
      { icon: <CreditCard className="w-5 h-5" />, label: 'Subscription', link: '/profile/subscription', rightElement: <Badge className="bg-amber-500">Gold</Badge> }
    ]
  },
  {
    title: 'Content',
    items: [
      { icon: <Heart className="w-5 h-5" />, label: 'Saved Recipes', link: '/profile/saved', rightBadge: '12' },
      { icon: <History className="w-5 h-5" />, label: 'Cooking History', link: '/profile/history' },
      { icon: <Award className="w-5 h-5" />, label: 'Achievements', link: '/profile/achievements', rightBadge: 'New', badgeColor: 'bg-sustainabite-orange' }
    ]
  },
  {
    title: 'Support',
    items: [
      { icon: <MessageCircle className="w-5 h-5" />, label: 'Feedback', link: '/profile/feedback' },
      { icon: <HelpCircle className="w-5 h-5" />, label: 'Help Center', link: '/profile/help' },
      { icon: <Settings className="w-5 h-5" />, label: 'Settings', link: '/profile/settings' }
    ]
  }
];

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      if (signOut) {
        await signOut();
      }
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error logging out',
        description: 'There was a problem logging you out.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-sustainabite-cream pb-24">
      {/* Swipe indicator */}
      <div className="fixed top-3 left-0 right-0 z-10 flex justify-center pointer-events-none opacity-30">
        <div className="flex items-center space-x-2 bg-black/10 backdrop-blur-sm px-3 py-1 rounded-full">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Swipe to navigate</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
      
      {/* Profile header */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={user?.user_metadata?.avatar_url || userData.avatar} 
              alt={user?.user_metadata?.full_name || userData.name} 
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-sustainabite-orange text-white text-xs font-medium py-0.5 px-2 rounded-full">
              {userData.tier}
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-serif font-medium">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || userData.name}
            </h1>
            <p className="text-muted-foreground">{user?.email || userData.email}</p>
          </div>
        </div>
      </div>
      
      {/* Profile preferences summary */}
      <div className="px-6 pb-6">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-lg font-medium mb-3">My Preferences</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Dietary Restrictions</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {userData.preferences.dietaryRestrictions.map((restriction, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-sustainabite-lightPurple/20 text-sustainabite-purple border-none text-xs"
                  >
                    {restriction}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Cooking Time</p>
              <p className="font-medium mt-1">{userData.preferences.cookingTime}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Daily Calories</p>
              <p className="font-medium mt-1">{userData.preferences.calories}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Cooking Level</p>
              <p className="font-medium mt-1">{userData.preferences.cookingLevel}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4 rounded-xl border border-sustainabite-purple/30 text-sustainabite-purple hover:bg-sustainabite-purple/5"
            size="sm"
            onClick={() => navigate('/profile/personal')}
          >
            Edit Preferences
          </Button>
        </div>
      </div>
      
      {/* Profile sections */}
      <div className="px-6 pb-6 space-y-6">
        {profileSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="glass-card rounded-2xl overflow-hidden">
            <h2 className="text-lg font-medium p-5 pb-2">{section.title}</h2>
            <Separator />
            
            {section.items.map((item, itemIndex) => (
              <a 
                key={itemIndex} 
                href={item.link} 
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {item.rightElement && item.rightElement}
                  {item.rightBadge && (
                    <Badge className={cn("text-xs", item.badgeColor)}>
                      {item.rightBadge}
                    </Badge>
                  )}
                  {!item.rightElement && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                </div>
              </a>
            ))}
          </div>
        ))}
      </div>
      
      {/* Logout button */}
      <div className="px-6 pb-12">
        <Button 
          variant="outline" 
          className="w-full py-6 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/5"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 w-5 h-5" />
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
