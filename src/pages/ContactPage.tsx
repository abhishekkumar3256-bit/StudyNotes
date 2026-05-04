import React from 'react';
import { Card, Input, Button } from '../components/ui/shared';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">Contact Us</h1>
        <p className="text-stone-500 text-lg">We're here to help you. Reach out anytime.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
            <Mail size={20} />
          </div>
          <h3 className="font-bold">Email Us</h3>
          <p className="text-sm text-stone-500">abhishekkumar3256@gmail.com</p>
        </Card>
        <Card className="p-6 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
            <MessageSquare size={20} />
          </div>
          <h3 className="font-bold">Live Chat</h3>
          <p className="text-sm text-stone-500">Available Mon-Fri <br/> 9 AM - 6 PM</p>
        </Card>
        <Card className="p-6 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
            <MapPin size={20} />
          </div>
          <h3 className="font-bold">Location</h3>
          <p className="text-sm text-stone-500">Bangalore, Karnataka <br/> India</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Send us a message</h2>
          <p className="text-stone-500">
            Have feedback, found a bug, or want to partner with us? Fill out the form and our team will get back to you within 24 hours.
          </p>
          <img 
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800" 
            alt="Support team" 
            className="rounded-2xl w-full h-64 object-cover border border-stone-200"
          />
        </div>

        <Card className="p-8 shadow-xl">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-stone-400">Name</label>
                <Input placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-stone-400">Email</label>
                <Input placeholder="john@example.com" type="email" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-stone-400">Subject</label>
              <Input placeholder="Feedback / Support" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-stone-400">Message</label>
              <textarea 
                className="flex min-h-[150px] w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                placeholder="How can we help you?"
              />
            </div>
            <Button className="w-full h-12 gap-2">
              <Send size={18} />
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
