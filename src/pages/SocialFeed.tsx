
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share, MoreVertical, UserPlus, Loader2, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';

interface Post {
  id: string;
  content: string;
  image_url: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
  recipe: {
    id: string;
    title: string;
  } | null;
  likes_count: number;
  comments_count: number;
  liked_by_user: boolean;
}

interface FriendSuggestion {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

const SocialFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('foryou');
  const [friendSuggestions, setFriendSuggestions] = useState<FriendSuggestion[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchFriendSuggestions();
  }, [user, activeTab]);

  const fetchPosts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // In a real app, we would fetch posts from the database
      // For now, we'll create mock posts
      
      setTimeout(() => {
        const mockPosts: Post[] = [
          {
            id: '1',
            content: 'Just made this amazing grilled salmon for dinner! So healthy and delicious. Highly recommend this recipe!',
            image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1170',
            created_at: new Date().toISOString(),
            user: {
              id: '2',
              username: 'masterchef',
              full_name: 'Master Chef',
              avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg'
            },
            recipe: {
              id: '1',
              title: 'Grilled Salmon with Asparagus'
            },
            likes_count: 24,
            comments_count: 5,
            liked_by_user: false
          },
          {
            id: '2',
            content: 'Made this healthy avocado toast for breakfast. Starting the day right!',
            image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1280',
            created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            user: {
              id: '3',
              username: 'foodlover',
              full_name: 'Food Lover',
              avatar_url: 'https://randomuser.me/api/portraits/women/33.jpg'
            },
            recipe: {
              id: '2',
              title: 'Avocado Toast with Poached Egg'
            },
            likes_count: 18,
            comments_count: 2,
            liked_by_user: true
          },
          {
            id: '3',
            content: 'Family loved these homemade chocolate chip cookies! Perfect weekend treat.',
            image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1164',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            user: {
              id: '2',
              username: 'masterchef',
              full_name: 'Master Chef',
              avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg'
            },
            recipe: {
              id: '6',
              title: 'Chocolate Chip Cookies'
            },
            likes_count: 32,
            comments_count: 7,
            liked_by_user: false
          }
        ];
        
        setPosts(mockPosts);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Failed to load posts",
        description: "Please try again later.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const fetchFriendSuggestions = async () => {
    if (!user) return;
    
    try {
      // In a real app, we would fetch friend suggestions from the database
      // For now, we'll create mock suggestions
      
      const mockSuggestions: FriendSuggestion[] = [
        {
          id: '4',
          username: 'healthyeats',
          full_name: 'Healthy Eats',
          avatar_url: 'https://randomuser.me/api/portraits/women/45.jpg'
        },
        {
          id: '5',
          username: 'chefmark',
          full_name: 'Chef Mark',
          avatar_url: 'https://randomuser.me/api/portraits/men/55.jpg'
        },
        {
          id: '6',
          username: 'sarahbakes',
          full_name: 'Sarah Baker',
          avatar_url: 'https://randomuser.me/api/portraits/women/67.jpg'
        }
      ];
      
      setFriendSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error fetching friend suggestions:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts.",
        variant: "destructive"
      });
      return;
    }
    
    // Toggle like status in the UI immediately for better UX
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikedStatus = !post.liked_by_user;
        return {
          ...post,
          liked_by_user: newLikedStatus,
          likes_count: newLikedStatus ? post.likes_count + 1 : post.likes_count - 1
        };
      }
      return post;
    }));
    
    // In a real app, we would update the database
    toast({
      title: "Post liked",
      description: "Your like has been recorded.",
    });
  };

  const handleAddFriend = async (friendId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add friends.",
        variant: "destructive"
      });
      return;
    }
    
    // Remove from suggestions in UI immediately for better UX
    setFriendSuggestions(friendSuggestions.filter(friend => friend.id !== friendId));
    
    // In a real app, we would update the database
    toast({
      title: "Friend request sent",
      description: "Your friend request has been sent.",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-sustainabite-cream pb-24">
      <div className="px-6 py-4 bg-white sticky top-0 z-10">
        <Tabs defaultValue="foryou" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="foryou">For You</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sustainabite-purple mb-4" />
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-150px)]">
          {posts.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">Follow more people to see their posts</p>
            </div>
          ) : (
            <div className="space-y-6 p-4">
              {/* Friend Suggestions */}
              {activeTab === 'foryou' && friendSuggestions.length > 0 && (
                <div className="glass-card rounded-xl p-4">
                  <h3 className="text-sm font-medium mb-3">People you might know</h3>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {friendSuggestions.map((friend) => (
                      <div key={friend.id} className="flex-shrink-0 w-24 text-center">
                        <div className="relative mx-auto mb-2">
                          <Avatar className="w-16 h-16 mx-auto">
                            <AvatarImage src={friend.avatar_url} alt={friend.username} />
                            <AvatarFallback>{friend.full_name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <Button 
                            size="icon"
                            className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-sustainabite-purple"
                            onClick={() => handleAddFriend(friend.id)}
                          >
                            <UserPlus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs font-medium truncate">{friend.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{friend.username}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Posts */}
              {posts.map((post) => (
                <div key={post.id} className="glass-card rounded-xl overflow-hidden">
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.user.avatar_url} alt={post.user.username} />
                        <AvatarFallback>{post.user.full_name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.user.full_name}</p>
                        <p className="text-xs text-muted-foreground">@{post.user.username}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Post Image */}
                  <div className="relative">
                    <img 
                      src={post.image_url} 
                      alt={post.recipe?.title || 'Food post'} 
                      className="w-full aspect-square object-cover" 
                    />
                    
                    {post.recipe && (
                      <div className="absolute bottom-3 right-3">
                        <Button 
                          className="bg-white/90 text-black hover:bg-white rounded-xl"
                          onClick={() => navigate(`/recipe/${post.recipe.id}`)}
                        >
                          <Award className="w-4 h-4 mr-2 text-sustainabite-purple" />
                          View Recipe
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Post Actions */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleLike(post.id)}
                        className={post.liked_by_user ? "text-red-500" : ""}
                      >
                        <Heart className="h-6 w-6" fill={post.liked_by_user ? "currentColor" : "none"} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageCircle className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share className="h-6 w-6" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{formatTimeAgo(post.created_at)}</p>
                  </div>
                  
                  {/* Post Content */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-sm">{post.likes_count} likes</p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">{post.comments_count} comments</p>
                    </div>
                    
                    <p className="text-sm">
                      <span className="font-medium">{post.user.username}</span>{' '}
                      {post.content}
                    </p>
                    
                    {post.recipe && (
                      <p className="text-sm text-sustainabite-purple mt-2">
                        Recipe: {post.recipe.title}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default SocialFeed;
