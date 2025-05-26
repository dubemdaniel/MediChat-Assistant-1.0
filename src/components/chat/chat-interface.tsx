'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import type { ChatMessage, MessageContent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, AlertTriangle, Bot, User } from 'lucide-react';
import { getBotResponses } from '@/app/chat/actions';
import ChatMessageBubble from './chat-message-bubble';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      sender: 'bot',
      content: { type: 'text', text: "Hello! I'm MediChat Assist. How can I help you today? Please describe your symptoms." },
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement> | string) => {
    if (typeof e !== 'string') {
      e.preventDefault();
    }
    
    const currentMessageText = typeof e === 'string' ? e : inputValue.trim();
    if (!currentMessageText) return;

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: { type: 'text', text: currentMessageText },
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    if (typeof e !== 'string') {
     setInputValue('');
    }
    setIsLoading(true);

    try {
      const botMessageContents = await getBotResponses(currentMessageText);
      const newBotMessages: ChatMessage[] = botMessageContents.map((content) => ({
        id: crypto.randomUUID(),
        sender: 'bot',
        content,
        timestamp: new Date(),
      }));
      setMessages((prevMessages) => [...prevMessages, ...newBotMessages]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorBotMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        content: { type: 'text', text: 'Sorry, something went wrong. Please try again.' },
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestionClick = (question: string) => {
    setInputValue(question); // Pre-fill input
    // Optionally, uncomment to auto-send
    // handleSendMessage(question); 
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg shadow-xl overflow-hidden border">
      <div className="p-4 border-b flex items-center gap-2">
        <Bot className="text-primary h-6 w-6" />
        <h2 className="text-lg font-semibold">MediChat Conversation</h2>
      </div>
      <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} onSuggestedQuestionClick={handleSuggestedQuestionClick}/>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 animate-pulse p-2">
            <Bot className="text-primary h-6 w-6" />
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type your symptoms..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-grow"
            aria-label="Chat input"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
