import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export interface FirebaseUser extends User {}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  type: 'restaurant' | 'hotel' | 'event';
  address: string;
  images: string[];
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}