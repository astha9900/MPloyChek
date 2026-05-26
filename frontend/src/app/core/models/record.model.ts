export type RecordStatus = 'Pending' | 'In Progress' | 'Completed' | 'Failed';
export type RecordPriority = 'Low' | 'Medium' | 'High';

export interface VerificationRecord {
  id: string;
  userId: string;
  candidateName: string;
  checkType: string;
  status: RecordStatus;
  priority: RecordPriority;
  assignedTo: string;
  completionDate: string | null;
  createdAt: string;
  remarks: string;
}

export interface RecordsResponse {
  records: VerificationRecord[];
  delay: number;
  total: number;
}
