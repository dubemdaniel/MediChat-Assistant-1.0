import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, User, Lightbulb, HelpCircle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onSuggestedQuestionClick?: (question: string) => void;
}

export default function ChatMessageBubble({ message, onSuggestedQuestionClick }: ChatMessageBubbleProps) {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    switch (message.content.type) {
      case 'text':
        return <p className="whitespace-pre-wrap">{message.content.text}</p>;
      case 'analysis':
        const { possibleConditions, confidenceLevels, reasoning } = message.content.analysis;
        return (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Info size={20} /> Symptom Analysis
              </CardTitle>
              <CardDescription>
                Based on the symptoms you provided, here are some possibilities:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {possibleConditions && possibleConditions.length > 0 ? (
                <>
                  <ul className="space-y-2">
                    {possibleConditions.map((condition, index) => (
                      <li key={condition} className="p-3 border rounded-md bg-secondary/50">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-secondary-foreground">{condition}</span>
                          {confidenceLevels && confidenceLevels[index] && (
                            <Badge variant="outline" className="text-xs">
                              Confidence: {(confidenceLevels[index] * 100).toFixed(0)}%
                            </Badge>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {reasoning && (
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Reasoning:</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reasoning}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">No specific conditions identified. Please provide more details or try rephrasing your symptoms.</p>
              )}
            </CardContent>
          </Card>
        );
      case 'suggested_questions':
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-1">
              <Lightbulb size={16} className="text-yellow-500" />
              Consider asking:
            </h4>
            <div className="flex flex-wrap gap-2">
              {message.content.questions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onSuggestedQuestionClick && onSuggestedQuestionClick(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        );
      case 'loading':
        return <p className="italic text-muted-foreground">Bot is typing...</p>;
      default:
        return null;
    }
  };

  return (
    <div className={cn('flex animate-in fade-in slide-in-from-bottom-4 duration-300', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-md md:max-w-lg lg:max-w-xl p-3 rounded-xl shadow-sm flex items-start gap-2.5',
          isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none border'
        )}
      >
        {isUser ? (
          <User className="h-6 w-6 text-primary-foreground/80 shrink-0 order-2" />
        ) : (
          <Bot className="h-6 w-6 text-primary shrink-0 order-1" />
        )}
        <div className={cn('flex-grow space-y-1', isUser ? 'order-1 text-right' : 'order-2 text-left')}>
          {renderContent()}
          <p className={cn('text-xs opacity-70 mt-1', isUser ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}
