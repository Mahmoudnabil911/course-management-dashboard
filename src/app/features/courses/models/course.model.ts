export interface Course {
  id: string;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number; // in hours
  price: number;
  status: 'Active' | 'Draft' | 'Archived';
  description?: string;
  createdDate: string; // YYYY-MM-DD
}
