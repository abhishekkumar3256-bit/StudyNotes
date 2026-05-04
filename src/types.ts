export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export interface Note {
  id: string;
  title: string;
  link: string;
  class: string;
  subject: string;
  date: any;
  remark?: string;
  authorId: string;
  status: 'approved' | 'pending';
}

export interface NoteRequest {
  id: string;
  title: string;
  link: string;
  class: string;
  subject: string;
  remark?: string;
  userId: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}
