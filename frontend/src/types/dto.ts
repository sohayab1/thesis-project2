export interface UserDto {
    id: number;
    name: string;
    email: string;
    nidNumber: string;
    role: string;
    approved: boolean;
    nidFrontPath?: string;
    nidBackPath?: string;
    selfieFrontPath?: string;
    selfieLeftPath?: string;
}

export interface ComplaintDto {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  // Add any other fields that your complaint object contains
}

export interface FeedbackDto {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    complaintId: number;
    userId: number;
}

export interface EvidenceDto {
    id: number;
    complaintId: number;
    filePath: string;
    fileType: string;
}

export interface DepartmentDto {
    id: number;
    name: string;
    description: string;
    active: boolean;
    complaintCount: number;
}

export interface ComplaintCreateDto {
    title: string;
    description: string;
    departmentId: number | string;
    location: string;
    incidentDate: string;
    suspectInfo?: string;
    suspectSocialMedia?: string;
    suspectPhoneNumber?: string;
}