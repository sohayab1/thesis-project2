export interface User {
  id: number;
  name: string;
  email: string;
  nidNumber: string;
  nidFrontPath?: string;
  nidBackPath?: string;
  selfieFrontPath?: string;
  selfieLeftPath?: string;
  approved: boolean;
  role: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface Evidence {
  id: number;
  fileName: string;
  filePath: string;
}

export interface Feedback {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}