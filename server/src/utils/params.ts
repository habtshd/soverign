import { Request } from 'express';

export function getParam(req: Request, key: string): string {
  const val = req.params[key];
  if (Array.isArray(val)) {
    return val[0];
  }
  return val as string;
}
