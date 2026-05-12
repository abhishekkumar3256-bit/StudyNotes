import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Zap, Users, ArrowRight } from 'lucide-react';
import { Button, Card } from '../components/ui/shared';
import { motion } from 'motion/react';

export default function HomePage() {
  return (
    <div className="space-y-20 py-10">
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-stone-600 border border-stone-200"
        >
          <Zap size={14} className="text-amber-500" />
          The Ultimate Study Companion
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400"
        >
          <span>Dev: Abhishek Kumar</span>
          <span className="h-3 w-[1px] bg-stone-200"></span>
          <span>v1.2.0 Stable</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900"
        >
          Study Smarter, <br />
          <span className="text-stone-400 font-serif italic">Not Harder.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-stone-500"
        >
          StudyNotes Pro is a decentralized repository of high-quality academic materials.
          Access verified notes, request new ones, and collaborate with your peers.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4"
        >
          <Link to="/browse">
            <Button className="h-12 px-8 text-base">Explore Notes</Button>
          </Link>
          <Link to="/about">
            <Button variant="secondary" className="h-12 px-8 text-base">Learn More</Button>
          </Link>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <Card className="p-8 space-y-4 hover:border-stone-400 transition-colors">
          <div className="h-12 w-12 rounded-xl bg-stone-900 text-white flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold">Verified Content</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Every note is reviewed by our admin team before publication to ensure accuracy and quality.
          </p>
        </Card>
        <Card className="p-8 space-y-4 hover:border-stone-400 transition-colors">
          <div className="h-12 w-12 rounded-xl bg-stone-900 text-white flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold">Secure Access</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Your data is protected with Firebase Security. Only authenticated users can access the repository.
          </p>
        </Card>
        <Card className="p-8 space-y-4 hover:border-stone-400 transition-colors">
          <div className="h-12 w-12 rounded-xl bg-stone-900 text-white flex items-center justify-center">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold">Community Driven</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Can't find what you need? Request a note and our community or admins will provide it for you.
          </p>
        </Card>
      </section>

      <section className="bg-stone-900 rounded-3xl p-10 md:p-20 text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Ready to boost your grades?</h2>
        <p className="text-stone-400 max-w-xl mx-auto">
          Join thousands of students who are already using StudyNotes Pro to streamline their learning journey.
        </p>
        <Link to="/browse" className="inline-block">
          <Button className="bg-white text-stone-900 hover:bg-stone-100 h-12 px-10 gap-2">
            Get Started Now
            <ArrowRight size={18} />
          </Button>
        </Link>
      </section>
    </div>
  );
}
