import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NoteRequest, OperationType } from '../types';
import { handleFirestoreError } from '../lib/error-handler';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/shared';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function UserRequests() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<NoteRequest[]>([]);

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, 'requests'),
      where('userId', '==', profile.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NoteRequest[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'requests');
    });

    return () => unsubscribe();
  }, [profile]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">My Requests</h1>
        <p className="text-sm text-stone-500">Track the status of your note submission requests.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {requests.map(request => (
          <Card key={request.id} className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-stone-900">{request.title}</h3>
                <p className="text-xs text-stone-500">{request.subject} • {request.class}</p>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {request.status === 'pending' && <Clock size={12} />}
                {request.status === 'approved' && <CheckCircle size={12} />}
                {request.status === 'rejected' && <XCircle size={12} />}
                {request.status}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <div className="flex items-center gap-1">
                <FileText size={12} />
                <span className="truncate max-w-[150px]">{request.link.replace(/^https?:\/\//, '')}</span>
              </div>
              <span>{new Date(request.createdAt?.toDate()).toLocaleDateString()}</span>
            </div>
            
            {request.remark && (
              <div className="mt-3 p-2 bg-stone-50 rounded border-l-2 border-stone-200">
                <p className="text-[11px] italic text-stone-500">"{request.remark}"</p>
              </div>
            )}
          </Card>
        ))}
        
        {requests.length === 0 && (
          <div className="md:col-span-2 flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dotted border-stone-300">
            <FileText className="text-stone-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-stone-500">No requests found</h3>
            <p className="text-stone-400 text-sm">You haven't submitted any note requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
