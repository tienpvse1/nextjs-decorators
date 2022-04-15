import { NextApiRequest } from 'next';

export type Request = NextApiRequest & { user: any };
export type Response = NextApiRequest;
