
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ExternalLink, Phone, MessageSquare, Heart } from 'lucide-react';

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Mental Health Resources</h1>
          <p className="text-muted-foreground mb-8">
            Finding support for your mental health is an important part of self-care. 
            Below are resources that can provide assistance when you need it.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Crisis Hotlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <p className="font-medium">988 Suicide & Crisis Lifeline</p>
                    <p className="text-muted-foreground">Call or text 988</p>
                    <a href="https://988lifeline.org/" target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 mt-1 hover:underline">
                      Visit website <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <p className="font-medium">Crisis Text Line</p>
                    <p className="text-muted-foreground">Text HOME to 741741</p>
                    <a href="https://www.crisistextline.org/" target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 mt-1 hover:underline">
                      Visit website <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Online Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <p className="font-medium">7 Cups</p>
                    <p className="text-muted-foreground">Free online chat with trained listeners</p>
                    <a href="https://www.7cups.com/" target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 mt-1 hover:underline">
                      Visit website <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <p className="font-medium">Mental Health America</p>
                    <p className="text-muted-foreground">Resources, tools, and community support</p>
                    <a href="https://mhanational.org/" target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 mt-1 hover:underline">
                      Visit website <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Self-Care Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Sometimes tracking your mood and emotions through color can be a helpful tool for self-awareness.
                  Here are some additional self-care resources:
                </p>
                <ul className="space-y-3">
                  <li>
                    <p className="font-medium">Mindfulness Exercises</p>
                    <p className="text-muted-foreground">Simple meditation and breathing techniques</p>
                    <a href="https://www.mindful.org/meditation/mindfulness-getting-started/" target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 mt-1 hover:underline">
                      Learn more <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <p className="font-medium">Psychology Today's Therapist Finder</p>
                    <p className="text-muted-foreground">Find mental health professionals in your area</p>
                    <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 mt-1 hover:underline">
                      Find a therapist <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-10 p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h2 className="text-xl font-medium mb-2">Remember</h2>
            <p>
              Tracking your emotional state through colors can help identify patterns, but it's not a substitute for professional help.
              If you're experiencing persistent mental health challenges, please reach out to a healthcare provider.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;
