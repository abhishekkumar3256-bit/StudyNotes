import React from 'react';
import { Card, Button } from '../components/ui/shared';
import { Share2, Copy, Twitter, Linkedin, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

export default function SharePage() {
  const currentUrl = window.location.origin;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-10">
      <header className="text-center space-y-4">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xl mb-6">
          <Share2 size={32} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">Spread the word</h1>
        <p className="text-stone-500 text-lg">Help your classmates by sharing StudyNotes Pro.</p>
      </header>

      <Card className="p-8 text-center space-y-6">
        <p className="text-stone-600">
          We believe knowledge grows when it's shared. Send this link to your study groups and friends!
        </p>
        
        <div className="flex items-center gap-2 p-2 bg-stone-100 rounded-lg border border-stone-200">
          <code className="text-xs flex-1 truncate text-stone-500 text-left px-2">
            {currentUrl}
          </code>
          <Button onClick={copyToClipboard} size="sm" className="h-8">
            <Copy size={14} className="mr-2" />
            Copy
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          <Button variant="secondary" className="gap-2 h-12">
            <Twitter size={18} className="text-[#1DA1F2]" />
            <span className="hidden sm:inline">Twitter</span>
          </Button>
          <Button variant="secondary" className="gap-2 h-12">
            <Linkedin size={18} className="text-[#0A66C2]" />
            <span className="hidden sm:inline">LinkedIn</span>
          </Button>
          <Button variant="secondary" className="gap-2 h-12">
            <Facebook size={18} className="text-[#1877F2]" />
            <span className="hidden sm:inline">Facebook</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-stone-900 rounded-2xl text-white space-y-2">
          <h4 className="font-bold italic text-stone-400">"The best place for notes"</h4>
          <p className="text-sm">I've improved my GPA significantly since I started using this. Highly recommended!</p>
          <span className="block text-[10px] uppercase font-bold tracking-widest text-stone-500">— Sarah, CS Major</span>
        </div>
        <div className="p-6 bg-amber-100 rounded-2xl text-amber-900 space-y-2 border border-amber-200">
          <h4 className="font-bold italic text-amber-700">"Requesting is so easy"</h4>
          <p className="text-sm">I couldn't find my syllabus notes anywhere. Requested them here and they were up in 2 days!</p>
          <span className="block text-[10px] uppercase font-bold tracking-widest text-amber-600">— Rahul, Engineering</span>
        </div>
      </div>
    </div>
  );
}
