
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Clock, Plus, User, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  recipe?: {
    id: string;
    title: string;
    image_url: string;
  };
  user: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  likes_count: number;
  comments_count: number;
  liked_by_user: boolean;
}

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [user, activeTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('posts')
        .select(`
          id,
          content,
          image_url,
          created_at,
          user_id,
          recipe_id,
          recipes:recipe_id (
            id,
            title,
            image_url
          ),
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (activeTab === 'friends' && user) {
        // Get list of friend IDs
        const { data: friendships } = await supabase
          .from('friendships')
          .select('friend_id')
          .eq('user_id', user.id)
          .eq('status', 'accepted');
          
        const { data: reverseFriendships } = await supabase
          .from('friendships')
          .select('user_id')
          .eq('friend_id', user.id)
          .eq('status', 'accepted');
          
        const friendIds = [
          ...(friendships?.map(f => f.friend_id) || []),
          ...(reverseFriendships?.map(f => f.user_id) || [])
        ];
        
        if (friendIds.length > 0) {
          query = query.in('user_id', friendIds);
        } else {
          // If no friends, return empty array
          setPosts([]);
          setLoading(false);
          return;
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Get like counts and check if user liked posts
      const postsWithMeta = await Promise.all((data || []).map(async (post) => {
        // Get like count
        const { count: likesCount } = await supabase
          .from('post_likes')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);
          
        // Get comment count
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);
          
        // Check if user has liked the post
        let likedByUser = false;
        if (user) {
          const { data: likeData } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .maybeSingle();
          
          likedByUser = !!likeData;
        }
        
        return {
          id: post.id,
          content: post.content,
          image_url: post.image_url,
          created_at: post.created_at,
          recipe: post.recipes,
          user: post.profiles,
          likes_count: likesCount,
          comments_count: commentsCount,
          liked_by_user: likedByUser
        };
      }));
      
      setPosts(postsWithMeta);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error fetching posts',
        description: 'Unable to load the social feed.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (currentlyLiked) {
        // Unlike post
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, liked_by_user: false, likes_count: post.likes_count - 1 }
            : post
        ));
      } else {
        // Like post
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, liked_by_user: true, likes_count: post.likes_count + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      toast({
        title: 'Error',
        description: 'Unable to like/unlike the post.',
        variant: 'destructive'
      });
    }
  };

  const formatPostDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return 'Just now';
    }
  };

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-medium mb-4">Please log in</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view the social feed.</p>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-medium">Social Feed</h1>
        <Link to="/friends">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Friends
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="friends">Friends Only</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-sustainabite-purple" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-background rounded-lg border border-border overflow-hidden">
              {/* Post header */}
              <div className="flex items-center p-4">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={post.user.avatar_url} alt={post.user.username} />
                  <AvatarFallback>{post.user.full_name?.substring(0, 2) || post.user.username?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{post.user.full_name || post.user.username}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatPostDate(post.created_at)}</span>
                  </div>
                </div>
              </div>
              
              {/* Post content */}
              {post.content && (
                <div className="px-4 py-2">
                  <p>{post.content}</p>
                </div>
              )}
              
              {/* Post image */}
              {post.image_url && (
                <div className="w-full aspect-square">
                  <img 
                    src={post.image_url} 
                    alt="Post" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Recipe card if present */}
              {post.recipe && (
                <Link to={`/recipe/${post.recipe.id}`}>
                  <div className="p-4 flex items-center gap-3 bg-muted/30">
                    <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={post.recipe.image_url} 
                        alt={post.recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1">Recipe</Badge>
                      <p className="font-medium">{post.recipe.title}</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              )}
              
              {/* Post actions */}
              <div className="flex items-center justify-between p-4 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center gap-1 ${post.liked_by_user ? 'text-red-500' : ''}`}
                  onClick={() => handleLike(post.id, post.liked_by_user)}
                >
                  <Heart className={`h-5 w-5 ${post.liked_by_user ? 'fill-red-500' : ''}`} />
                  <span>{post.likes_count}</span>
                </Button>
                <Link to={`/post/${post.id}`}>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.comments_count}</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {activeTab === 'friends' ? "No posts from friends yet" : "No posts yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {activeTab === 'friends' 
              ? "Add more friends or encourage them to share their cooking adventures!" 
              : "Be the first to share your cooking adventure!"}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
