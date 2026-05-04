import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Note, NoteRequest, OperationType } from '../types';
import { handleFirestoreError } from '../lib/error-handler';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Filter,
  FileText,
  Save,
  X,
  ExternalLink
} from 'lucide-react';
import { Button, Input, Card } from '../components/ui/shared';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'notes' | 'requests'>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [requests, setRequests] = useState<NoteRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const notesUnsubscribe = onSnapshot(
      query(collection(db, 'notes'), orderBy('date', 'desc')),
      (snapshot) => {
        setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Note[]);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'notes')
    );

    const requestsUnsubscribe = onSnapshot(
      query(collection(db, 'requests'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NoteRequest[]);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'requests')
    );

    return () => {
      notesUnsubscribe();
      requestsUnsubscribe();
    };
  }, []);

  const openModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setLink(note.link);
      setClassName(note.class);
      setSubject(note.subject);
      setRemark(note.remark || '');
    } else {
      setEditingNote(null);
      setTitle('');
      setLink('');
      setClassName('');
      setSubject('');
      setRemark('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        title,
        link,
        class: className,
        subject,
        remark,
        date: serverTimestamp(),
        status: 'approved' as const,
      };

      if (editingNote) {
        await updateDoc(doc(db, 'notes', editingNote.id), data);
      } else {
        await addDoc(collection(db, 'notes'), { ...data, authorId: 'admin' });
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingNote ? OperationType.UPDATE : OperationType.CREATE, 'notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'notes');
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject', requestData?: NoteRequest) => {
    try {
      if (action === 'approve' && requestData) {
        // Create note first
        await addDoc(collection(db, 'notes'), {
          title: requestData.title,
          link: requestData.link,
          class: requestData.class,
          subject: requestData.subject,
          remark: requestData.remark || '',
          authorId: requestData.userId,
          date: serverTimestamp(),
          status: 'approved',
        });
      }
      // Update request status
      await updateDoc(doc(db, 'requests', requestId), {
        status: action === 'approve' ? 'approved' : 'rejected'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'requests');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Admin Dashboard</h1>
          <p className="text-sm text-stone-500">Manage study materials and user requests.</p>
        </div>
        <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'notes' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            All Notes
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all relative ${
              activeTab === 'requests' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Requests
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                {requests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'notes' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="font-semibold text-stone-700">Manage Published Notes</h2>
            <Button onClick={() => openModal()} className="gap-2">
              <Plus size={18} />
              Add Note
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map(note => (
              <Card key={note.id} className="p-4 flex flex-col group h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="rounded-lg bg-stone-100 p-2 text-stone-600">
                    <FileText size={20} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => openModal(note)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(note.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <h3 className="font-bold text-stone-900 line-clamp-1">{note.title}</h3>
                <p className="text-xs text-stone-500 mb-4">{note.subject} • {note.class}</p>
                {note.remark && (
                   <p className="text-[11px] text-stone-400 italic bg-stone-50 p-2 rounded mb-3 line-clamp-1 border-l-2 border-stone-200">
                    {note.remark}
                  </p>
                )}
                <div className="mt-auto pt-3 border-t border-stone-50 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Added: {new Date(note.date?.toDate()).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {requests.map(request => (
              <Card key={request.id} className={`p-5 border-l-4 ${
                request.status === 'pending' ? 'border-amber-400' : 
                request.status === 'approved' ? 'border-emerald-400' : 'border-red-400'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {request.status}
                      </span>
                      <span className="text-[11px] text-stone-400 font-medium">
                        {new Date(request.createdAt?.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900">{request.title}</h3>
                    <p className="text-xs text-stone-500">Requested by: <span className="font-semibold text-stone-700">{request.userName}</span></p>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleRequestAction(request.id, 'approve', request)}
                        className="h-9 w-9 p-0 bg-emerald-600 hover:bg-emerald-700" 
                        title="Approve"
                      >
                        <CheckCircle2 size={18} />
                      </Button>
                      <Button 
                        onClick={() => handleRequestAction(request.id, 'reject')}
                        className="h-9 w-9 p-0 bg-red-600 hover:bg-red-700" 
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                  <div className="bg-stone-50 p-2 rounded">
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Subject</span>
                    <span className="font-semibold text-stone-700">{request.subject}</span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded">
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Class</span>
                    <span className="font-semibold text-stone-700">{request.class}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <a href={request.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1 group">
                    <span className="group-hover:underline">View Source Link</span>
                    <ExternalLink size={14} />
                  </a>
                  {request.remark && (
                    <span className="text-[11px] italic text-stone-400 bg-stone-50 px-2 py-1 rounded truncate max-w-[200px]">
                      "{request.remark}"
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
          {requests.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dotted border-stone-300">
                <Clock className="text-stone-300 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-stone-500">No requests yet</h3>
             </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <Card className="p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-stone-900">{editingNote ? 'Edit Note' : 'Add New Note'}</h2>
                  <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsModalOpen(false)}>
                    <X size={20} />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Title</label>
                    <Input placeholder="E.g. Calculus Basics" value={title} onChange={e => setTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Link (URL)</label>
                    <Input placeholder="https://..." value={link} onChange={e => setLink(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Class</label>
                      <Input placeholder="E.g. Grade 10" value={className} onChange={e => setClassName(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Subject</label>
                      <Input placeholder="E.g. Mathematics" value={subject} onChange={e => setSubject(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Remark (Optional)</label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                      placeholder="Any additional info..."
                      value={remark}
                      onChange={e => setRemark(e.target.value)}
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="flex-1 gap-2" disabled={loading}>
                      <Save size={18} />
                      {loading ? 'Saving...' : 'Save Note'}
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
