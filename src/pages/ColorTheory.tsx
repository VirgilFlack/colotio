
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ExternalLink, Palette, Heart, Brain } from 'lucide-react';

const ColorTheory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Color Theory & Emotions</h1>
          <p className="text-muted-foreground mb-8">
            Colors can be powerful tools for expressing and understanding emotions. Below is a guide to how different 
            colors relate to emotional states, both positive and negative.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="bg-red-50 dark:bg-red-900/20">
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <div className="w-6 h-6 rounded-full bg-red-500"></div>
                  Red
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <p className="font-medium text-green-600 dark:text-green-400">Positive Associations:</p>
                  <p className="text-muted-foreground">Love, passion, energy, excitement, strength, warmth</p>
                </div>
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Negative Associations:</p>
                  <p className="text-muted-foreground">Anger, rage, danger, aggression, stress, tension</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
                <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <div className="w-6 h-6 rounded-full bg-orange-500"></div>
                  Orange
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <p className="font-medium text-green-600 dark:text-green-400">Positive Associations:</p>
                  <p className="text-muted-foreground">Creativity, enthusiasm, joy, determination, encouragement</p>
                </div>
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Negative Associations:</p>
                  <p className="text-muted-foreground">Frustration, impatience, superficiality, pessimism</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
                <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                  Yellow
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <p className="font-medium text-green-600 dark:text-green-400">Positive Associations:</p>
                  <p className="text-muted-foreground">Happiness, optimism, confidence, clarity, warmth, sunshine</p>
                </div>
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Negative Associations:</p>
                  <p className="text-muted-foreground">Anxiety, fear, caution, cowardice, criticism</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <div className="w-6 h-6 rounded-full bg-green-500"></div>
                  Green
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <p className="font-medium text-green-600 dark:text-green-400">Positive Associations:</p>
                  <p className="text-muted-foreground">Growth, harmony, health, nature, peace, balance, renewal</p>
                </div>
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Negative Associations:</p>
                  <p className="text-muted-foreground">Envy, jealousy, materialism, stagnation, boredom</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                  Blue
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <p className="font-medium text-green-600 dark:text-green-400">Positive Associations:</p>
                  <p className="text-muted-foreground">Trust, loyalty, wisdom, confidence, faith, truth, tranquility</p>
                </div>
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Negative Associations:</p>
                  <p className="text-muted-foreground">Sadness, depression, coldness, passivity, loneliness</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
                <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                  Purple
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <p className="font-medium text-green-600 dark:text-green-400">Positive Associations:</p>
                  <p className="text-muted-foreground">Creativity, wisdom, dignity, independence, mystery, magic</p>
                </div>
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Negative Associations:</p>
                  <p className="text-muted-foreground">Decadence, excess, moodiness, introspection, suppression</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Color Theory in Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Understanding how colors influence emotions can help you:
                </p>
                <ul className="space-y-3">
                  <li>
                    <p className="font-medium">Track Your Emotional State</p>
                    <p className="text-muted-foreground">Record your daily emotions using colors to identify patterns over time</p>
                  </li>
                  <li>
                    <p className="font-medium">Enhance Self-Awareness</p>
                    <p className="text-muted-foreground">Use colors as a quick way to check in with yourself without needing many words</p>
                  </li>
                  <li>
                    <p className="font-medium">Color Therapy</p>
                    <p className="text-muted-foreground">Surround yourself with colors that evoke the emotions you want to cultivate</p>
                    <a href="https://www.psychologytoday.com/us/blog/arts-and-health/201406/color-psychology-psychotherapeutic-tool" target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 mt-1 hover:underline">
                      Learn more about color therapy <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-10 p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h2 className="text-xl font-medium mb-2">Understanding the Science</h2>
            <p className="mb-4">
              Color psychology is both subjective and cultural. While some reactions to colors are universal, many are shaped by personal experiences and cultural backgrounds. The associations listed here reflect common Western interpretations.
            </p>
            <p>
              Remember that your personal associations with colors may differ based on your experiences and background. Trust your intuition when using colors for emotional expression.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ColorTheory;
