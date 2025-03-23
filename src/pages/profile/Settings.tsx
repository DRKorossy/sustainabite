
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [units, setUnits] = useState('metric');
  const [theme, setTheme] = useState('light');
  const [dataCollection, setDataCollection] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully.',
      });
    }, 1500);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error logging out',
        description: 'There was a problem signing you out.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-serif font-medium">Settings</h1>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Preferences</h2>
          
          <div className="space-y-3">
            <Label htmlFor="units">Measurement Units</Label>
            <Select value={units} onValueChange={setUnits}>
              <SelectTrigger id="units">
                <SelectValue placeholder="Select units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (g, ml, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (oz, fl oz, in)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Privacy</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-collection" className="font-medium">
                Data Collection
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow anonymous usage data to improve the app
              </p>
            </div>
            <Switch
              id="data-collection"
              checked={dataCollection}
              onCheckedChange={setDataCollection}
            />
          </div>
        </div>
        
        <Button 
          className="w-full bg-sustainabite-purple hover:bg-sustainabite-purple/90 mt-6"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 mt-8"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 w-4 h-4" />
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
