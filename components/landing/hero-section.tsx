'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles, Shield, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Floating particles with fixed positions */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '10%', top: '20%', animationDelay: '0s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '80%', top: '15%', animationDelay: '0.5s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '25%', top: '60%', animationDelay: '1s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '70%', top: '70%', animationDelay: '1.5s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '45%', top: '30%', animationDelay: '2s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '90%', top: '50%', animationDelay: '2.5s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-2 md:px-6 py-8 md:py-24">
        {/* Main content */}
        <div className="text-center mb-16  ">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-8 text-blue-200">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Health Assistant</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
            Welcome to
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              MediChat Assist
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Your intelligent companion for understanding potential medical conditions based on your symptoms.
            <span className="block mt-2 text-cyan-200">
              Engage in a conversation and get insights in natural language.
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/chat'}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-full"
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              Start Your Health Chat
            </Button>
            
            {/* <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-blue-300/50 text-blue-100 hover:bg-blue-500/20 backdrop-blur-sm px-8 py-4 text-lg rounded-full transition-all duration-300"
            >
              Learn More
            </Button> */}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Natural Conversation</h3>
            <p className="text-blue-200">Describe your symptoms in simple, everyday language</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-indigo-400 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">AI Analysis</h3>
            <p className="text-blue-200">Advanced AI processes your input for accurate insights</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Reliable Information</h3>
            <p className="text-blue-200">Get possible conditions with clear reasoning</p>
          </div>
        </div>

        {/* How it works section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-3 md:p-12 max-w-6xl mx-auto shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="space-y-6 text-left">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <p className="text-blue-100 text-lg">Describe your symptoms in simple, natural terms - no medical jargon needed.</p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-indigo-400 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <p className="text-blue-100 text-lg">Our advanced AI analyzes your input using medical knowledge and reasoning.</p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <p className="text-blue-100 text-lg">Receive a comprehensive list of possible conditions with clear explanations.</p>
            </div>
          </div>
          
          <div className="mt-10 p-6 bg-yellow-500/10 border border-yellow-400/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-200">Important Disclaimer</span>
            </div>
            <p className="text-yellow-100 leading-relaxed">
              MediChat Assist is an AI-powered tool designed for informational purposes only. 
              It does not provide medical advice, diagnosis, or treatment recommendations. 
              Always consult with a qualified healthcare professional for any health concerns or before making medical decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { MessageCircle } from 'lucide-react';

// export default function HeroSection() {
//   return (
//     <section className="text-center py-16 md:py-24">
//       <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 drop-shadow-md text-outline">
//         Welcome to MediChat Assist
//       </h1>
//       <p className="text-2xl md:text-xl text-foreground mb-8 max-w-2xl mx-auto font-semibold drop-shadow-lg">
//         Your intelligent companion for understanding potential medical conditions based on your symptoms.
//         Engage in a conversation and get insights in natural language.
//       </p>
//       <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
//         <Link href="/chat">
//           <MessageCircle className="mr-2 h-5 w-5" />
//           Start Chat
//         </Link>
//       </Button>
//       <div className="mt-12 p-6 border rounded-lg bg-card max-w-3xl mx-auto shadow-md">
//         <h2 className="text-2xl font-semibold text-primary mb-4">How It Works</h2>
//         <ul className="list-disc list-inside text-left space-y-2 text-foreground">
//           <li>Describe your symptoms in simple terms.</li>
//           <li>Our AI analyzes your input.</li>
//           <li>Receive a list of possible conditions and reasoning.</li>
//         </ul>
//         <p className="mt-6 text-sm text-muted-foreground">
//           <strong>Disclaimer:</strong> MediChat Assist is an AI-powered tool for informational purposes only. It does not provide medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional for any health concerns.
//         </p>
//       </div>
//     </section>
//   );
// }
