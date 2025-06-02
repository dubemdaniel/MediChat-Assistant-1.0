'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import type { ChatMessage, MessageContent, ConsultationState } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, AlertTriangle, Bot, User, Stethoscope, Heart } from 'lucide-react';
import { getBotResponses } from '@/app/chat/actions';
import ChatMessageBubble from './chat-message-bubble';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      sender: 'bot',
      content: { 
        type: 'text', 
        text: "👋 Hello, I'm Dr. MediChat, your AI medical assistant. I'm here to help you understand your symptoms and provide medical guidance.\n\nPlease tell me:\n• What symptoms are you experiencing?\n• How long have you had these symptoms?\n• How would you rate your pain (if any) from 1-10?\n\nRemember, I'm here to provide information and guidance, but this doesn't replace professional medical care." 
      },
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [consultationState, setConsultationState] = useState<ConsultationState>({
    phase: 'gathering_info',
    patientInfo: {},
    conversationHistory: [],
    urgencyLevel: 'low'
  });
  
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
      // Update consultation state with new user message
      const updatedState = {
        ...consultationState,
        conversationHistory: [
          ...consultationState.conversationHistory,
          {
            sender: 'patient' as const,
            message: currentMessageText,
            timestamp: new Date().toISOString()
          }
        ]
      };

      const botMessageContents = await getBotResponses(currentMessageText, updatedState);
      
      const newBotMessages: ChatMessage[] = botMessageContents.map((content) => ({
        id: crypto.randomUUID(),
        sender: 'bot',
        content,
        timestamp: new Date(),
      }));
      
      setMessages((prevMessages) => [...prevMessages, ...newBotMessages]);

      // Update consultation state based on responses
      if (botMessageContents.some(content => content.type === 'doctor_consultation')) {
        const consultationContent = botMessageContents.find(content => content.type === 'doctor_consultation');
        if (consultationContent && consultationContent.type === 'doctor_consultation') {
          setConsultationState(prev => ({
            ...prev,
            urgencyLevel: consultationContent.consultation.urgencyLevel,
            phase: consultationContent.consultation.assessmentComplete ? 'diagnosis' : 'gathering_info'
          }));
        }
      }

    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorBotMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        content: { 
          type: 'text', 
          text: 'I apologize, but I encountered a technical issue. Please try again, or if this continues, consider contacting a healthcare professional directly.' 
        },
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpClick = (question: string) => {
    handleSendMessage(question);
  };

  const getPhaseDisplay = () => {
    switch (consultationState.phase) {
      case 'gathering_info':
        return { text: 'Gathering Information', color: 'bg-blue-100 text-blue-800' };
      case 'diagnosis':
        return { text: 'Analyzing Symptoms', color: 'bg-yellow-100 text-yellow-800' };
      case 'treatment_planning':
        return { text: 'Treatment Planning', color: 'bg-green-100 text-green-800' };
      case 'follow_up':
        return { text: 'Follow-up Care', color: 'bg-purple-100 text-purple-800' };
      default:
        return { text: 'Consultation', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getUrgencyDisplay = () => {
    switch (consultationState.urgencyLevel) {
      case 'emergency':
        return { text: 'EMERGENCY', color: 'bg-red-500 text-white', icon: AlertTriangle };
      case 'high':
        return { text: 'High Priority', color: 'bg-orange-500 text-white', icon: AlertTriangle };
      case 'medium':
        return { text: 'Medium Priority', color: 'bg-yellow-500 text-white', icon: null };
      default:
        return { text: 'Routine', color: 'bg-green-500 text-white', icon: null };
    }
  };

  const phaseDisplay = getPhaseDisplay();
  const urgencyDisplay = getUrgencyDisplay();

  return (
    <div className="flex flex-col h-full bg-card rounded-lg shadow-xl overflow-hidden border">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="text-primary h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold">Dr. MediChat</h2>
              <p className="text-xs text-muted-foreground">AI Medical Assistant</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={phaseDisplay.color}>
              {phaseDisplay.text}
            </Badge>
            {/* <Badge className={urgencyDisplay.color}>
              {urgencyDisplay.icon && <urgencyDisplay.icon size={12} className="mr-1" />}
              {urgencyDisplay.text}
            </Badge> */}
          </div>
        </div>
        
        {consultationState.urgencyLevel === 'emergency' && (
          <Alert className="mt-3 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Emergency Alert:</strong> Please seek immediate medical attention or call emergency services.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex flex-col flex-grow overflow-hidden w-full max-w-4xl mx-auto">
        <ScrollArea className="flex-grow p-2 pr-3 md:pr-0 md:p-4 space-y-4" ref={scrollAreaRef}>
          {messages.map((msg) => (
            <ChatMessageBubble 
              key={msg.id} 
              message={msg} 
              onFollowUpClick={handleFollowUpClick}
            />
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 animate-pulse p-2">
              <Bot className="text-primary h-6 w-6" />
              <div className="flex flex-col space-y-1">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
                <Skeleton className="h-3 w-40 rounded-md" />
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder={
              consultationState.phase === 'gathering_info' 
                ? "Describe your symptoms in detail..." 
                : "Ask me anything about your condition or treatment..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-grow"
            aria-label="Chat input"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()} 
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        
        {/* Quick Action Buttons */}
        {/* {consultationState.phase === 'gathering_info' && (
          <div className="flex md:gap-2 gap-1 mt-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleFollowUpClick("I'm experiencing pain")}
              disabled={isLoading}
            >
              🤕 I have pain
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleFollowUpClick("I have a fever")}
              disabled={isLoading}
            >
              🌡️ I have fever
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleFollowUpClick("I'm feeling sick")}
              disabled={isLoading}
            >
              🤢 Feeling sick
            </Button>
          </div>
        )} */}
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          ⚠️ This AI assistant provides information only. Always consult healthcare professionals for medical decisions.
        </p>
      </form>
    </div>
  );
}