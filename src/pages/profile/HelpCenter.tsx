
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqs = [
    {
      question: "How do I save a recipe?",
      answer: "To save a recipe, simply open the recipe details page and click the heart icon in the top right corner. You can access your saved recipes from your profile page."
    },
    {
      question: "How does the grocery recognition feature work?",
      answer: "The grocery recognition feature uses your device's camera to identify groceries. Simply point your camera at the grocery items, and the app will identify them and add them to your grocery list."
    },
    {
      question: "Can I create my own recipes?",
      answer: "Yes! You can create your own recipes by going to the 'Recipes' tab and selecting the 'Created' tab. There you'll find a button to create a new recipe."
    },
    {
      question: "How are calories calculated?",
      answer: "Calories are calculated based on the ingredients used in each recipe and their respective nutritional values. We use standard nutritional databases to ensure accuracy."
    },
    {
      question: "How do I track my cooking streak?",
      answer: "Your cooking streak is automatically tracked when you mark recipes as cooked. You can view your current streak on your profile page."
    },
  ];
  
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-serif font-medium">Help Center</h1>
      </div>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search help topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl"
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No results found for "{searchQuery}"
            </p>
          )}
        </Accordion>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Contact Support</h2>
        <p className="text-sm text-muted-foreground">
          Didn't find what you're looking for? Get in touch with our support team.
        </p>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button className="justify-start" variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email Support
          </Button>
          <Button className="justify-start" variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" />
            Live Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
