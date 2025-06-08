export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'mini-project' | 'final-year' | 'mentorship';
  price: number;
  technologies: string[];
  thumbnail?: string;
  demoLink?: string;
  downloadUrl?: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  // Payment related fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  purchasedBy?: string[];  // Array of user IDs who purchased
  sourceCodeUrl?: string;  // URL to download source code after payment
  lastPurchasedAt?: Date;  // Timestamp of last purchase
}

export interface ProjectCreate extends Omit<Project, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export interface ProjectUpdate extends Partial<ProjectCreate> {
  id: string;
  updatedAt?: Date;
}