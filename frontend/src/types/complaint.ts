export interface ComplaintCreateDto {
  title: string;
  description: string;
  departmentId: string | number;
  location: string;
  incidentDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  reporterType: 'victim' | 'reporter' | 'business' | 'witness';
}

export interface Department {
  id: number;
  name: string;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  departmentId: number;
  department?: {
    id: number;
    name: string;
  };
  feedback?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}