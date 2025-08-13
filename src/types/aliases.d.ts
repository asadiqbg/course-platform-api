// src/types/aliases.d.ts
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNext } from 'express';

// These now include augmentation from global.d.ts
type Req = ExpressRequest;
type Res = ExpressResponse;
type Next = ExpressNext;

export { Req, Res, Next };
