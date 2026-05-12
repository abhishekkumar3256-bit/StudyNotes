import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Note, OperationType } from '../types';
import { handleFirestoreError } from '../lib/error-handler';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  Calendar, 
  BookOpen,
  Plus,
  X
} from 'lucide-react';
import { Button, Input, Select, Card } from '../components/ui/shared';
import { motion, AnimatePresence } from 'motion/react';

export default function UserDashboard() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  // Request states
  const [reqTitle, setReqTitle] = useState('');
  const [reqLink, setReqLink] = useState('');
  const [reqClass, setReqClass] = useState('');
  const [reqSubject, setReqSubject] = useState('');
  const [reqRemark, setReqRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'notes'),
      where('status', '==', 'approved'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(notesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notes');
    });

    return () => unsubscribe();
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === '' || note.class === classFilter;
    const matchesSubject = subjectFilter === '' || note.subject === subjectFilter;
    return matchesSearch && matchesClass && matchesSubject;
  });

  const classes = Array.from(new Set(notes.map(n => n.class))).sort();
  const subjects = Array.from(new Set(notes.map(n => n.subject))).sort();

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'requests'), {
        title: reqTitle,
        link: reqLink,
        class: reqClass,
        subject: reqSubject,
        remark: reqRemark,
        userId: profile.uid,
        userName: profile.name,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsRequestModalOpen(false);
      // Reset form
      setReqTitle('');
      setReqLink('');
      setReqClass('');
      setReqSubject('');
      setReqRemark('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'requests');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Study Materials</h1>
          <p className="text-sm text-stone-500">Everything you need to excel in your classes.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-stone-100 px-4 py-2 text-center shadow-sm border border-stone-200">
            <span className="block text-2xl font-bold text-stone-900">{filteredNotes.length}</span>
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Total Notes</span>
          </div>
          {profile?.role === 'student' && (
            <Button onClick={() => setIsRequestModalOpen(true)} className="gap-2">
              <Plus size={18} />
              Request Note
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4 bg-stone-50/50">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <Input 
              placeholder="Search by title..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="">All Classes</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
          </div>
          <div className="relative">
            <Select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <motion.div
            key={note.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full flex flex-col p-5 hover:shadow-md transition-shadow group">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-lg bg-stone-100 p-2 text-stone-600 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <FileText size={20} />
                </div>
                <a 
                  href={note.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
              
              <h3 className="font-bold text-stone-900 line-clamp-2 mb-2">{note.title}</h3>
              
              <div className="mt-auto space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-stone-100 px-2 py-1 text-[10px] font-bold uppercase text-stone-600">
                    {note.subject}
                  </span>
                  <span className="rounded bg-stone-100 px-2 py-1 text-[10px] font-bold uppercase text-stone-600">
                    {note.class}
                  </span>
                </div>
                
                {note.remark && (
                  <p className="text-xs text-stone-500 line-clamp-2 bg-stone-50 p-2 rounded italic border-l-2 border-stone-200">
                    "{note.remark}"
                  </p>
                )}
                
                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-medium">
                  <Calendar size={12} />
                  <span>{new Date(note.date?.toDate()).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-stone-100 p-4 text-stone-400">
            <Search size={40} />
          </div>
          <h2 className="text-xl font-semibold text-stone-900">No notes found</h2>
          <p className="text-stone-500">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* Request Modal */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsRequestModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <Card className="p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-stone-900">Request New Note</h2>
                  <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsRequestModalOpen(false)}>
                    <X size={20} />
                  </Button>
                </div>

                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Title</label>
                    <Input placeholder="E.g. Calculus Basics" value={reqTitle} onChange={e => setReqTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Link (URL)</label>
                    <Input placeholder="https://..." value={reqLink} onChange={e => setReqLink(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Class</label>
                      <Input placeholder="E.g. Grade 10" value={reqClass} onChange={e => setReqClass(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Subject</label>
                      <Input placeholder="E.g. Mathematics" value={reqSubject} onChange={e => setReqSubject(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Remark (Optional)</label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                      placeholder="Any additional info..."
                      value={reqRemark}
                      onChange={e => setReqRemark(e.target.value)}
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
