import {Request, Response, NextFunction} from 'express';
import { setOriginalNode } from 'typescript';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if(!req.currentUser) {
        throw new NotAuthorizedError();
    } else {
        next();
    }
}