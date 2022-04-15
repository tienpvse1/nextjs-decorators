import { NextApiRequest, NextApiResponse } from 'next';

export const CLASS_MIDDLEWARE = 'CLASS_MIDDLEWARE';
export const METHOD_MIDDLEWARE = 'METHOD_MIDDLEWARE';

export type Middleware = (req: NextApiRequest, res: NextApiResponse) => any;
export interface IMiddleware {
  key?: string;
  method: Middleware;
}

const generateMethodMiddleware = (
  target: Object,
  key: string | symbol,
  middleware: Middleware
) => {
  if (!Reflect.getMetadata(METHOD_MIDDLEWARE, target.constructor)) {
    Reflect.defineMetadata(METHOD_MIDDLEWARE, [], target.constructor);
  }
  const middlewaresList: IMiddleware[] = Reflect.getMetadata(
    METHOD_MIDDLEWARE,
    target.constructor
  );
  middlewaresList.push({
    method: middleware,
    key: key.toString(),
  });
  Reflect.defineMetadata(
    METHOD_MIDDLEWARE,
    middlewaresList,
    target.constructor
  );
};
const generateClassMiddleware = (target: Object, middleware: Middleware) => {
  if (!Reflect.getMetadata(CLASS_MIDDLEWARE, target)) {
    Reflect.defineMetadata(CLASS_MIDDLEWARE, [], target);
  }
  const middlewaresList: IMiddleware[] = Reflect.getMetadata(
    CLASS_MIDDLEWARE,
    target
  );
  middlewaresList.push({
    method: middleware,
  });
};

export const UseMiddleware = (middleware: Middleware) => {
  return (target: Object, key: string | symbol) => {
    if (key) {
      generateMethodMiddleware(target, key, middleware);
    } else {
      generateClassMiddleware(target, middleware);
    }
  };
};
