
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const Notifications = () => {
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [weeklyDigestEnabled, setWeeklyDigestEnabled] = useState(true);
  const [newRecipesEnabled, setNewRecipesEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const savePreferences = async () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Preferences saved',
        description: 'Your notification preferences have been updated.'
      });
    }, 1000);
  };

  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-serif font-medium">Notifications</h1>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Push Notifications</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push" className="font-medium">Enable push notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
            </div>
            <Switch
              id="push"
              checked={pushEnabled}
              onCheckedChange={setPushEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-recipes" className="font-medium">New recipe recommendations</Label>
              <p className="text-sm text-muted-foreground">Get notified about new recipes</p>
            </div>
            <Switch
              id="new-recipes"
              checked={newRecipesEnabled}
              onCheckedChange={setNewRecipesEnabled}
              disabled={!pushEnabled}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Email Notifications</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email" className="font-medium">Enable email notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              id="email"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-digest" className="font-medium">Weekly digest</Label>
              <p className="text-sm text-muted-foreground">Weekly summary of new content</p>
            </div>
            <Switch
              id="weekly-digest"
              checked={weeklyDigestEnabled}
              onCheckedChange={setWeeklyDigestEnabled}
              disabled={!emailEnabled}
            />
          </div>
        </div>
        
        <Button 
          className="w-full bg-sustainabite-purple hover:bg-sustainabite-purple/90 mt-6"
          onClick={savePreferences}
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
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Notifications;
