import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { handlingRedirectRoute } from '../utils/handling-redirect';
import { checkRoute } from '../utils/match-route';
import { IRoutes, ROUTES } from './method.decorator';
import {
  CLASS_MIDDLEWARE,
  IMiddleware,
  METHOD_MIDDLEWARE,
} from './middleware.decorator';
export const handler = (
  Controller: Function,
  databaseRegister?: () => void
) => {
  if (databaseRegister) {
    databaseRegister();
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
      for (const { method } of classMiddleware) {
        try {
          const result = await method(req, res);
          if (result) return res.status(StatusCodes.OK).json(result);
        } catch (error) {
          // @ts-ignore
          return res.status(404).json(error);
        }
      }
    }
    // get all the routes from the metadata of the controller class
    const routes: IRoutes[] = Reflect.getMetadata(ROUTES, Controller);
    for (const route of routes) {
      if (methodMiddleware && methodMiddleware.length > 0) {
        const filteredMethod = methodMiddleware.filter(
          middleware => middleware.key === route.name
        );
        for (const { method } of filteredMethod) {
          try {
            const result = method(req, res);
            if (result) return res.status(StatusCodes.OK).json(result);
          } catch (error) {
            // @ts-ignore
            return res.status(404).json(error);
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
