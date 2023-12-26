import { Request } from 'express';

export type TypedRequest<T> = Request<{}, {}, T>;
