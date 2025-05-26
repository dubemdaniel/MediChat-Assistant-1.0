import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
        Welcome to MediChat Assist
      </h1>
      <p className="text-lg md:text-xl text-foreground mb-8 max-w-2xl mx-auto">
        Your intelligent companion for understanding potential medical conditions based on your symptoms.
        Engage in a conversation and get insights in natural language.
      </p>
      <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="/chat">
          <MessageCircle className="mr-2 h-5 w-5" />
          Start Chat
        </Link>
      </Button>
      <div className="mt-12 p-6 border rounded-lg bg-card max-w-3xl mx-auto shadow-md">
        <h2 className="text-2xl font-semibold text-primary mb-4">How It Works</h2>
        <ul className="list-disc list-inside text-left space-y-2 text-foreground">
          <li>Describe your symptoms in simple terms.</li>
          <li>Our AI analyzes your input.</li>
          <li>Receive a list of possible conditions and reasoning.</li>
          <li>Get suggestions for follow-up questions to consider.</li>
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> MediChat Assist is an AI-powered tool for informational purposes only. It does not provide medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional for any health concerns.
        </p>
      </div>
    </section>
  );
}
