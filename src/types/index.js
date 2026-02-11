// All our app's data types live here!

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';  // Future feature!
  createdAt: number;  // Timestamp for sorting
}

export interface User {
  uid: string;
  email: string;
  displayName?: string | null;
}

export type Priority = 'low' | 'medium' | 'high';
