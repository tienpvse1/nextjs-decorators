import { NextApiRequest, NextApiResponse } from 'next';
import {
  CLASS_MIDDLEWARE,
  IMiddleware,
  METHOD_MIDDLEWARE,
  MiddlewareType,
} from './middleware.decorator';

export type Guard = (req: NextApiRequest, res: NextApiResponse) => boolean;

const generateMethodGuard = (
  target: Object,
  key: string | symbol,
  guard: Guard
) => {
  if (!Reflect.getMetadata(METHOD_MIDDLEWARE, target.constructor)) {
    Reflect.defineMetadata(METHOD_MIDDLEWARE, [], target.constructor);
  }
  const guardsList: IMiddleware[] = Reflect.getMetadata(
    METHOD_MIDDLEWARE,
    target.constructor
  );
  guardsList.push({
    method: guard,
    key: key.toString(),
    type: MiddlewareType.GUARD,
  });
  Reflect.defineMetadata(METHOD_MIDDLEWARE, guardsList, target.constructor);
};
const generateClassGuard = (target: Object, guard: Guard) => {
  if (!Reflect.getMetadata(CLASS_MIDDLEWARE, target)) {
    Reflect.defineMetadata(CLASS_MIDDLEWARE, [], target);
  }
  const guardsList: IMiddleware[] = Reflect.getMetadata(
    CLASS_MIDDLEWARE,
    target
  );
  guardsList.push({
    method: guard,
    type: MiddlewareType.GUARD,
  });
};

export const UseGuard = (guard: Guard) => {
  return (target: Object, key: string | symbol) => {
    if (key) {
      generateMethodGuard(target, key, guard);
    } else {
      generateClassGuard(target, guard);
    }
  };
};
