// src/types/aliases.d.ts
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNext } from 'express';

type Req = ExpressRequest;
type Res = ExpressResponse;
type Next = ExpressNext;

export { Req, Res, Next };
