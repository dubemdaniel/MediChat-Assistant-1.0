import ChatInterface from "@/components/chat/chat-interface";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-10rem)] -mx-2">
      <ChatInterface />
    </div>
  );
}
