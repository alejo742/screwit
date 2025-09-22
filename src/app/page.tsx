"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { SquarePen, BookText, Network, Zap, } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import PromptBox from "@/shared/components/PromptBox";
import useAuth from '@/features/users/hooks/useAuth';
import { signInOrRegister } from "@/features/users/utils/signInOrRegister";
import { ROUTES } from "@/shared/constants";
import { AgentOption } from "@/shared/types/ai-agent";

export default function Home() {
  const {
    user,
    loading
  } = useAuth();

  const router = useRouter();

  function handleGetStarted() {
    if (user) {
      // redirect to dashboard
      router.push(ROUTES.DASHBOARD);
    } else {
      // sign in or register with Google
      signInOrRegister('google')
        .then(() => {
          // redirect to dashboard after successful sign in or registration
          router.push(ROUTES.DASHBOARD);
        })
        .catch((error) => {
          console.error('Error during sign in or registration:', error);
        });
    }
  }

  function handlePromptSubmit(prompt: string, options: AgentOption[]) {
    const handleAuth = () => {
      const enabledOptions = options.filter(opt => opt.enabled).map(opt => opt.id);
      const queryParams = new URLSearchParams({
        prompt,
        options: enabledOptions.join(',')
      });
      router.push(`${ROUTES.DASHBOARD}?${queryParams.toString()}`);
    };

    if (user) {
      handleAuth();
    } else {
      // sign in or register with Google
      signInOrRegister('google')
        .then(() => {
          handleAuth();
        })
        .catch((error) => {
          console.error('Error during sign in or registration:', error);
        });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar user={user} loading={loading} onGetStarted={handleGetStarted} />
      {/* Hero Section */}
      <section className="flex justify-center items-center min-h-[70vh] py-8">
        <div className="w-full max-w-5xl px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-md text-foreground leading-tight mb-4">
              Event creation,&nbsp;
              <strong className="font-bold text-accent-300">simplified.</strong>
            </h1>
            <p className="text-lg text-muted-foreground">Fill the Dartmouth Groups funding form in under 5 minutes.</p>
          </div>
          <PromptBox 
            onSubmit={handlePromptSubmit}
            placeholder="Describe your event idea... (e.g., 'I want to host a pizza party for 50 people')"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Built for Dartmouth Students
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to navigate campus life more efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <SquarePen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Didn&apos;t like what AI gave you? You can change it, tweak it, and make it your own.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BookText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Powerful context</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                No hallucination. The AI agent is fed with real Dartmouth event data.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Network  className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Real-time organization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                The AI agent can search Amazon, Instacart, restaurant menus, and more.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Quick completion</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                The browser extension autofills the whole form for you. Just one click.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>Made with 💚 by AM &apos;28</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
