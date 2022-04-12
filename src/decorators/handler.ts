import { NextApiRequest, NextApiResponse } from 'next';
import { match } from 'path-to-regexp';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { IRoutes, ROUTES } from './method.decorator';
import { IParam, SupportedDecorators, SupportedType } from './param.decorator';
export const handler = (
  Controller: Function,
  databaseRegister?: () => void
) => {
  if (databaseRegister) {
    databaseRegister();
  }
  //@ts-ignore
  container.resolve(Controller);
  //@ts-ignore
  const instance = new Controller();
  const path: string = Reflect.getMetadata('controller:prefix', Controller);
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const routes: IRoutes[] = Reflect.getMetadata(ROUTES, Controller);
    for (const route of routes) {
      let fullPath = '/' + path;
      if (route.path.length > 0) {
        fullPath += '/' + route.path;
      }

      const matchUrl = match(fullPath, { decode: decodeURIComponent });
      const matchResult = matchUrl(req.url!);

      if (req.method === route.method && matchResult) {
        let params: IParam[] =
          Reflect.getMetadata(SupportedDecorators.METHOD_PARAM, Controller) ||
          [];
        let bodies: IParam[] =
          Reflect.getMetadata(SupportedDecorators.BODY, Controller) || [];
        params = params.filter(item => item.ownerName === route.name);
        bodies = bodies.filter(item => item.ownerName === route.name);
        const paramList = [...params, ...bodies];
        paramList.sort((a, b) => a.index - b.index);

        const methodParams = paramList.map(item => {
          if (item.type === SupportedType.PARAM) {
            // @ts-ignore
            return matchResult.params[item.path!];
          }
          if (item.type === SupportedType.BODY) {
            return req.body;
          }
        });

        const result = await instance[route.name](...methodParams);
        return res.json(result);
      }
    }
  };
};
