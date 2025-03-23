
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface CommentProps {
  id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  likes_count: number;
  liked_by_user: boolean;
}

interface CommentSectionProps {
  postId: string;
  onCommentAdded?: () => void;
}

const CommentSection = ({ postId, onCommentAdded }: CommentSectionProps) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Transform comments to add like information
      const commentsWithLikes = await Promise.all((commentsData || []).map(async (comment) => {
        // Get like count
        const { count: likesCount } = await supabase
          .from('comment_likes')
          .select('id', { count: 'exact' })
          .eq('comment_id', comment.id);
          
        // Check if user has liked the comment
        let likedByUser = false;
        if (user) {
          const { data: likeData } = await supabase
            .from('comment_likes')
            .select('id')
            .eq('comment_id', comment.id)
            .eq('user_id', user.id)
            .maybeSingle();
          
          likedByUser = !!likeData;
        }
        
        return {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user: comment.profiles,
          likes_count: likesCount,
          liked_by_user: likedByUser
        };
      }));
      
      setComments(commentsWithLikes);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error fetching comments',
        description: 'Unable to load comments.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!comment.trim()) return;
    
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: comment.trim()
        })
        .select();
      
      if (error) throw error;
      
      setComment('');
      
      // Refresh comments
      fetchComments();
      
      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error posting comment',
        description: 'Unable to post your comment.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string, currentlyLiked: boolean) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (currentlyLiked) {
        // Unlike comment
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
        
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, liked_by_user: false, likes_count: comment.likes_count - 1 }
            : comment
        ));
      } else {
        // Like comment
        await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id
          });
        
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, liked_by_user: true, likes_count: comment.likes_count + 1 }
            : comment
        ));
      }
    } catch (error) {
      console.error('Error liking/unliking comment:', error);
      toast({
        title: 'Error',
        description: 'Unable to like/unlike the comment.',
        variant: 'destructive'
      });
    }
  };

  const formatCommentDate = (dateString: string) => {
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

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin w-6 h-6 text-sustainabite-purple" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="p-3 bg-background rounded-lg border">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.avatar_url} alt={comment.user.username} />
                  <AvatarFallback>{comment.user.full_name?.substring(0, 2) || comment.user.username?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{comment.user.full_name || comment.user.username}</p>
                    <span className="text-xs text-muted-foreground">{formatCommentDate(comment.created_at)}</span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                  <div className="flex items-center mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => handleLikeComment(comment.id, comment.liked_by_user)}
                    >
                      <Heart className={cn("h-3 w-3 mr-1", comment.liked_by_user && "fill-red-500 text-red-500")} />
                      <span>{comment.likes_count}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4 text-sm">No comments yet. Be the first to comment!</p>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!comment.trim() || submitting}
          className="bg-sustainabite-purple text-white hover:bg-sustainabite-purple/90"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};

export default CommentSection;
