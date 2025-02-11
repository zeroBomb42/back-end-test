import { Request, Response } from 'express';
import { err } from './debug';

export const success = (res: Response, message: string, result: object = {}, code: number = 200) => {
  return res.status(code).json({ success: true, message, result });
};

interface MsgObject {
  message: string;
  [key: string]: any;
}

export const failed = (req: Request, res: Response, msg: string | MsgObject, error: any, code?: number) => {
  err(error || msg, req.originalUrl);
  let obj = { success: false, message: '', result: {} };
  if (typeof msg === 'string') {
    obj = { ...obj, message: msg };
  } else {
    const { message, ...utils } = msg;
    obj = { ...obj, message, result: utils };
  }

  return res.status(code || 400).json(obj);
};

export const failedMsg = (res: Response, message: string, result: object = {}, code: number = 400) => { 
  return res.status(code).json({ success: false, message, result });
};
