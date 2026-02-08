// src/types.d.ts

import 'express';

declare module 'express' {
  interface Request {
    session?: {
      flash?: {
        type: string;
        title: string;
        message: string;
      };
      user?: any;
    } | null;
  }
}
