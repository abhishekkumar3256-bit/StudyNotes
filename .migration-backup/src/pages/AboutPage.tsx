import React from 'react';
import { Card } from '../components/ui/shared';
import { motion } from 'motion/react';
import { Target, Heart, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">About StudyNotes Pro</h1>
        <p className="text-stone-500 text-lg">Empowering students through accessible academic resources.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-stone-600 leading-relaxed">
            StudyNotes Pro was founded on the belief that high-quality study materials should be available to everyone, regardless of their background or location. We strive to bridge the gap between classroom teaching and independent study.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
                <Target size={16} />
              </div>
              <p className="text-sm text-stone-600"><span className="font-bold text-stone-900">Education First:</span> We prioritize learning outcomes over profit.</p>
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
                <Heart size={16} />
              </div>
              <p className="text-sm text-stone-600"><span className="font-bold text-stone-900">Built for Students:</span> Designed by developers who understand the student struggle.</p>
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
                <Shield size={16} />
              </div>
              <p className="text-sm text-stone-600"><span className="font-bold text-stone-900">Quality Assured:</span> Every piece of content is manually verified.</p>
            </div>
          </div>
        </div>
        <Card className="aspect-square bg-stone-100 flex items-center justify-center p-10 border-dashed">
          <div className="text-center space-y-2">
            <div className="text-6xl font-bold text-stone-900">10k+</div>
            <div className="text-stone-500 uppercase tracking-widest text-xs font-bold">Students Served</div>
          </div>
        </Card>
      </div>

      <Card className="p-10 bg-stone-50 border-stone-200">
        <h3 className="text-xl font-bold mb-4">Our Story</h3>
        <p className="text-stone-600 text-sm leading-relaxed">
          What started as a small shared folder among classmates has evolved into StudyNotes Pro. We recognized that students often struggle to find clear, concise, and accurate notes for specific subjects. By creating a centralized hub where administrators can verify and publish high-quality links, we've created a reliable sanctuary for academic growth.
        </p>
      </Card>
    </div>
  );
}
