export interface User {
  id: string;
  username: string;
  password: string;
  role: 'Admin' | 'General User';
  name: string;
  email: string;
  department: string;
  phone: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Record {
  id: string;
  userId: string;
  candidateName: string;
  checkType: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  completionDate: string | null;
  createdAt: string;
  remarks: string;
}

export interface AuthPayload {
  id: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
