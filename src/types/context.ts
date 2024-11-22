import { Request, Response } from 'express';
import { userRole } from '../enums/book.enum';

export interface Context {
  req: Request;
  res: Response;
  user?: { userId: number; userRole: userRole };
}
