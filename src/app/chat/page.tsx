import ChatInterface from '@/components/chat/chat-interface';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)]">
      <ChatInterface />
    </div>
  );
}
