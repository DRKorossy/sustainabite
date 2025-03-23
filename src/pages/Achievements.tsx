
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved?: boolean;
  achieved_at?: string;
}

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      
      // Get all achievements
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*');
      
      if (achievementsError) throw achievementsError;
      
      // Get user's achievements
      const { data: userAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('achievement_id, achieved_at')
        .eq('user_id', user?.id);
      
      if (userAchievementsError) throw userAchievementsError;
      
      // Map achievements with achievement status
      const achievedMap = new Map(
        userAchievements?.map(item => [item.achievement_id, item.achieved_at]) || []
      );
      
      const mappedAchievements = allAchievements?.map(achievement => ({
        ...achievement,
        achieved: achievedMap.has(achievement.id),
        achieved_at: achievedMap.get(achievement.id)
      })) || [];
      
      // Sort achievements: achieved first, then unachieved
      mappedAchievements.sort((a, b) => {
        if (a.achieved && !b.achieved) return -1;
        if (!a.achieved && b.achieved) return 1;
        return 0;
      });
      
      setAchievements(mappedAchievements);
      
      // Calculate progress percentage
      if (allAchievements?.length) {
        const achieved = userAchievements?.length || 0;
        const total = allAchievements.length;
        const percent = Math.round((achieved / total) * 100);
        setProgressPercent(percent);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast({
        title: 'Error fetching achievements',
        description: 'Unable to load your achievements.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-medium mb-4">Please log in</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your achievements.</p>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-serif font-medium">Achievements</h1>
      </div>
      
      <div className="glass-card p-6 rounded-xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Progress</h2>
          <div className="bg-sustainabite-purple text-white px-2 py-1 rounded-md text-sm font-medium">
            {progressPercent}%
          </div>
        </div>
        
        <Progress value={progressPercent} className="h-2 mb-2" />
        
        <p className="text-sm text-muted-foreground">
          {achievements.filter(a => a.achieved).length} of {achievements.length} achievements unlocked
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-sustainabite-purple" />
        </div>
      ) : achievements.length > 0 ? (
        <div className="space-y-4">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border ${
                achievement.achieved 
                  ? 'bg-gradient-to-r from-sustainabite-purple/10 to-sustainabite-orange/10 border-sustainabite-purple/30' 
                  : 'bg-muted/30 border-muted'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.achieved 
                    ? 'bg-sustainabite-purple text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Award className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  
                  {achievement.achieved && (
                    <div className="mt-2 text-xs text-sustainabite-purple font-medium">
                      Achieved on {formatDate(achievement.achieved_at)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Award className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No achievements yet</h3>
          <p className="text-muted-foreground mb-6">Start cooking to earn achievements!</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;
