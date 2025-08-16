import { Evidence, Feedback, User } from "./user";

export type ReporterType = 'victim' | 'reporter' | 'business' | 'witness';
export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ComplaintCreateDto {
  title: string;
  description: string;
  departmentId: string | number;
  location: string;
  incidentDate: string;
  suspectInfo?: string;
  suspectSocialMedia?: string;
  suspectPhoneNumber?: string;
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

export interface ComplaintDto {
    id: number;
    title: string;
    description: string;
    status: ComplaintStatus;
    priority: ComplaintPriority;
    location: string;
    incidentDate: string;
    createdAt: string;
    updatedAt?: string;
    suspectInfo?: string;
    suspectSocialMedia?: string;
    suspectPhoneNumber?: string;
    rating?: number;
    feedback?: string;
    feedbackDate?: string;
    evidences?: Array<{
        id: number;
        filePath: string;
        fileType: string;
    }>;
    user: {
        id: number;
        name: string;
        email: string;
    };
    department?: {
        id: number;
        name: string;
    };
}