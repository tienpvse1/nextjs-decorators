import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { PRISMA_CLIENT } from '../constance';
import { Unauthorize } from '../error';
import { handlingRedirectRoute } from '../utils/handling-redirect';
import { checkRoute } from '../utils/match-route';
// import { CLASS_GUARD, IGuard } from './guard.decorator';
import { IRoutes, ROUTES } from './method.decorator';
import {
  CLASS_MIDDLEWARE,
  IMiddleware,
  METHOD_MIDDLEWARE,
  MiddlewareType,
} from './middleware.decorator';
export const handler = (
  Controller: Function,
  enablePrisma = false 
) => {
  if (enablePrisma) {
    container.register<PrismaClient>(PRISMA_CLIENT, {
      useValue: new PrismaClient(),
    });
  }
  // register the controller into the tsyringe container to perform dependency injection
  //@ts-ignore
  container.resolve(Controller);

  // this will return the handler with routes which next.js can read and forward request
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const classMiddleware: IMiddleware[] = Reflect.getMetadata(
      CLASS_MIDDLEWARE,
      Controller
    );
    const methodMiddleware: IMiddleware[] = Reflect.getMetadata(
      METHOD_MIDDLEWARE,
      Controller
    );
    if (classMiddleware) {
      const reversedMiddlewares = [...classMiddleware].reverse();

      for (const { method, type } of reversedMiddlewares) {
        if (type === MiddlewareType.MIDDLEWARE) {
          try {
            const result = await method(req, res);
            if (result) return res.status(StatusCodes.OK).json(result);
          } catch (error) {
            // @ts-ignore
            return res.status(error.code).json(error);
          }
        } else if (type === MiddlewareType.GUARD) {
          try {
            const result = await method(req, res);
            if (!Boolean(result)) throw new Unauthorize();
          } catch (error) {
            // @ts-ignore
            return res.status(error.code).json(error);
          }
        }
      }
    }
    // get all the routes from the metadata of the controller class
    const routes: IRoutes[] = Reflect.getMetadata(ROUTES, Controller);
    for (const route of routes) {
      if (methodMiddleware && methodMiddleware.length > 0) {
        const reversedMiddlewares = [...methodMiddleware].reverse();
        const filteredMethod = reversedMiddlewares.filter(
          middleware => middleware.key === route.name
        );
        for (const { method, type } of filteredMethod) {
          if (type === MiddlewareType.MIDDLEWARE) {
            try {
              const result = method(req, res);
              if (result) return res.status(StatusCodes.OK).json(result);
            } catch (error) {
              // @ts-ignore
              return res.status(404).json(error);
            }
          } else if (type === MiddlewareType.GUARD) {
            try {
              const result = await method(req, res);
              if (!Boolean(result)) throw new Unauthorize();
            } catch (error) {
              // @ts-ignore
              return res.status(error.code).json(error);
            }
          }
        }
      }

      const matchResult = checkRoute(Controller, route, req.url!);

      if (req.method === route.method && matchResult) {
        handlingRedirectRoute(Controller, route, req, res);
      }
    }
  };
};
