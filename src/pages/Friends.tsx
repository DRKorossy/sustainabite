
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserCheck, X, Search, UserX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const Friends = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchPendingRequests();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const { data: friendships, error } = await supabase
        .from('friendships')
        .select(`
          id,
          friend_id,
          status,
          profiles!friendships_friend_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      if (error) throw error;

      // Also get friendships where the user is the friend
      const { data: reverseFriendships, error: reverseError } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          status,
          profiles!friendships_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('friend_id', user?.id)
        .eq('status', 'accepted');

      if (reverseError) throw reverseError;

      // Combine and format the data
      const formattedFriends = [
        ...(friendships || []).map(f => ({
          id: f.id,
          userId: f.friend_id,
          username: f.profiles.username,
          fullName: f.profiles.full_name,
          avatarUrl: f.profiles.avatar_url
        })),
        ...(reverseFriendships || []).map(f => ({
          id: f.id,
          userId: f.user_id,
          username: f.profiles.username,
          fullName: f.profiles.full_name,
          avatarUrl: f.profiles.avatar_url
        }))
      ];

      setFriends(formattedFriends);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: 'Error fetching friends',
        description: 'Unable to load your friends list.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      // Fetch friend requests sent to the user
      const { data: requests, error } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          status,
          profiles!friendships_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('friend_id', user?.id)
        .eq('status', 'pending');

      if (error) throw error;

      const formattedRequests = (requests || []).map(request => ({
        id: request.id,
        userId: request.user_id,
        username: request.profiles.username,
        fullName: request.profiles.full_name,
        avatarUrl: request.profiles.avatar_url,
        type: 'incoming'
      }));

      // Fetch friend requests sent by the user
      const { data: sentRequests, error: sentError } = await supabase
        .from('friendships')
        .select(`
          id,
          friend_id,
          status,
          profiles!friendships_friend_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'pending');

      if (sentError) throw sentError;

      const formattedSentRequests = (sentRequests || []).map(request => ({
        id: request.id,
        userId: request.friend_id,
        username: request.profiles.username,
        fullName: request.profiles.full_name,
        avatarUrl: request.profiles.avatar_url,
        type: 'outgoing'
      }));

      setPendingRequests([...formattedRequests, ...formattedSentRequests]);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      toast({
        title: 'Error fetching friend requests',
        description: 'Unable to load your friend requests.',
        variant: 'destructive'
      });
    }
  };

  const searchUsers = async () => {
    try {
      setSearchLoading(true);
      
      // Search for users by username or full name
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.%${searchTerm}%, full_name.ilike.%${searchTerm}%`)
        .neq('id', user?.id)
        .limit(20);
      
      if (error) throw error;
      
      // Filter out users who are already friends or have pending requests
      const friendIds = [...friends.map(f => f.userId), ...pendingRequests.map(r => r.userId)];
      const filteredResults = data?.filter(profile => !friendIds.includes(profile.id)) || [];
      
      setSearchResults(filteredResults.map(profile => ({
        userId: profile.id,
        username: profile.username,
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url
      })));
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: 'Error searching users',
        description: 'Unable to search for users.',
        variant: 'destructive'
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .insert({
          user_id: user?.id,
          friend_id: friendId,
          status: 'pending'
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Friend request sent',
        description: 'Your friend request has been sent successfully.',
      });
      
      // Update pending requests list
      fetchPendingRequests();
      
      // Remove from search results
      setSearchResults(searchResults.filter(result => result.userId !== friendId));
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: 'Error sending friend request',
        description: 'Unable to send friend request.',
        variant: 'destructive'
      });
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: 'Friend request accepted',
        description: 'You are now friends!',
      });
      
      // Refresh lists
      fetchFriends();
      fetchPendingRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: 'Error accepting friend request',
        description: 'Unable to accept friend request.',
        variant: 'destructive'
      });
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: 'Friend request rejected',
        description: 'The friend request has been rejected.',
      });
      
      // Remove from pending requests
      setPendingRequests(pendingRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: 'Error rejecting friend request',
        description: 'Unable to reject friend request.',
        variant: 'destructive'
      });
    }
  };

  const cancelFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: 'Friend request cancelled',
        description: 'Your friend request has been cancelled.',
      });
      
      // Remove from pending requests
      setPendingRequests(pendingRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      toast({
        title: 'Error cancelling friend request',
        description: 'Unable to cancel friend request.',
        variant: 'destructive'
      });
    }
  };

  const unfriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);
      
      if (error) throw error;
      
      toast({
        title: 'Friend removed',
        description: 'Friend has been removed successfully.',
      });
      
      // Remove from friends list
      setFriends(friends.filter(friend => friend.id !== friendshipId));
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: 'Error removing friend',
        description: 'Unable to remove friend.',
        variant: 'destructive'
      });
    }
  };

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-medium mb-4">Please log in</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your friends.</p>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-24">
      <h1 className="text-2xl font-serif font-medium mb-4">Friends</h1>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-5 rounded-xl"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="all">All Friends</TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Requests
            {pendingRequests.filter(req => req.type === 'incoming').length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-sustainabite-purple">
                {pendingRequests.filter(req => req.type === 'incoming').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Search Results */}
      {searchTerm.length > 2 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Search Results</h2>
          
          {searchLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin w-6 h-6 text-sustainabite-purple" />
            </div>
          ) : searchResults.length > 0 ? (
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-2">
                {searchResults.map(result => (
                  <div key={result.userId} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={result.avatarUrl} alt={result.username} />
                        <AvatarFallback>{result.fullName?.substring(0, 2) || result.username?.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{result.fullName || result.username}</p>
                        <p className="text-xs text-muted-foreground">@{result.username}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-sustainabite-purple text-sustainabite-purple hover:bg-sustainabite-purple/10"
                      onClick={() => sendFriendRequest(result.userId)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No users found</p>
          )}
        </div>
      )}
      
      {/* All Friends Tab */}
      {activeTab === 'all' && (
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-sustainabite-purple" />
            </div>
          ) : friends.length > 0 ? (
            <div className="space-y-3">
              {friends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={friend.avatarUrl} alt={friend.username} />
                      <AvatarFallback>{friend.fullName?.substring(0, 2) || friend.username?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{friend.fullName || friend.username}</p>
                      <p className="text-xs text-muted-foreground">@{friend.username}</p>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => unfriend(friend.id)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No friends yet</h3>
              <p className="text-muted-foreground mb-6">Search for users to add as friends</p>
            </div>
          )}
        </div>
      )}
      
      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-sustainabite-purple" />
            </div>
          ) : pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.filter(req => req.type === 'incoming').length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Incoming Requests</h3>
                  <div className="space-y-3">
                    {pendingRequests
                      .filter(req => req.type === 'incoming')
                      .map(request => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={request.avatarUrl} alt={request.username} />
                              <AvatarFallback>{request.fullName?.substring(0, 2) || request.username?.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{request.fullName || request.username}</p>
                              <p className="text-xs text-muted-foreground">@{request.username}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="default" 
                              className="bg-sustainabite-purple hover:bg-sustainabite-purple/90"
                              onClick={() => acceptFriendRequest(request.id)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-destructive text-destructive hover:bg-destructive/10"
                              onClick={() => rejectFriendRequest(request.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {pendingRequests.filter(req => req.type === 'outgoing').length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Sent Requests</h3>
                  <div className="space-y-3">
                    {pendingRequests
                      .filter(req => req.type === 'outgoing')
                      .map(request => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={request.avatarUrl} alt={request.username} />
                              <AvatarFallback>{request.fullName?.substring(0, 2) || request.username?.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{request.fullName || request.username}</p>
                              <p className="text-xs text-muted-foreground">@{request.username}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-muted-foreground"
                            onClick={() => cancelFriendRequest(request.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No friend requests</h3>
              <p className="text-muted-foreground">You don't have any pending friend requests</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;
