import { Evidence, Feedback, User } from "./user";

export type ReporterType = 'victim' | 'reporter' | 'business' | 'witness';
export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ComplaintCreateDto {
  title: string;
  description: string;
  departmentId: string;
  location: string;
  incidentDate: string;
  priority: ComplaintPriority;
  reporterType: ReporterType;
  suspect?: {
    name: string;
    contact: string;
    address: string;
    description: string;
  };
}

export interface Department {
  id: number;
  name: string;
}

export interface Complaint extends Omit<ComplaintCreateDto, 'departmentId'> {
  id: number;
  status: ComplaintStatus;
  createdAt: string;
  resolvedDate?: string;
  userId: number;
  user?: User;
  departmentId?: number;
  department?: Department;
  evidences?: Evidence[];
  feedback?: Feedback;
}