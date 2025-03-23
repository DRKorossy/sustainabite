
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const Feedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast({
        title: 'Empty feedback',
        description: 'Please enter your feedback before submitting.',
        variant: 'destructive'
      });
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setFeedback('');
      
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
      });
    }, 1500);
  };

  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-serif font-medium">Feedback</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label>What type of feedback do you have?</Label>
          <RadioGroup defaultValue="suggestion" value={feedbackType} onValueChange={setFeedbackType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="suggestion" id="suggestion" />
              <Label htmlFor="suggestion">Suggestion</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bug" id="bug" />
              <Label htmlFor="bug">Bug report</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="feature" id="feature" />
              <Label htmlFor="feature">Feature request</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="feedback">Your feedback</Label>
          <Textarea
            id="feedback"
            placeholder="Share your thoughts with us..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-sustainabite-purple hover:bg-sustainabite-purple/90"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default Feedback;
