// types/Context.ts

import { Request } from 'express';

export interface Context {
  req: Request; // The HTTP request (to access headers, etc.)
  user?: { userId: number; userRole: string }; // Optional: Populated after middleware
}
