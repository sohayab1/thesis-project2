import { UserRole } from './enums';

export type ReporterType = 'victim' | 'reporter' | 'business' | 'witness';
export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
    id: number;
    name: string;
    email: string;
    nidNumber: string;
    role: UserRole;
    approved: boolean;
    nidFrontPath?: string | null;
    nidBackPath?: string | null;
    selfieFrontPath?: string | null;
    selfieLeftPath?: string | null;
    departmentId?: number;
}

export interface Evidence {
    id: number;
    fileName: string;
    filePath: string;
    fileType: string;
    complaintId: number;
}

export interface Feedback {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    complaintId: number;
    userId: number;
}

export interface Department {
    id: number;
    name: string;
    description?: string;
}

export interface Complaint {
    id: number;
    title: string;
    description: string;
    status: ComplaintStatus;
    createdAt: string;
    location?: string;
    incidentDate?: string;
    priority: ComplaintPriority;
    resolvedDate?: string;
    userId: number;
    user?: User;
    departmentId?: number;
    department?: Department;
    evidences?: Evidence[];
    feedback?: Feedback;
    suspect?: {
        name: string;
        contact: string;
        address: string;
        description: string;
    };
}