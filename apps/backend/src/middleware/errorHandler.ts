import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : '서버 내부 오류가 발생했습니다.';

  console.error(`[ERROR] ${statusCode} - ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({ success: false, error: message });
};

export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
