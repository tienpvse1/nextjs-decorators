import { NextApiRequest, NextApiResponse } from 'next';
import { IRoutes } from '../decorators/method.decorator';
import { SupportedType } from '../decorators/param.decorator';
import { generateParam } from './generate-param';

export const handlingRedirectRoute = async (
  Controller: Object,
  route: IRoutes,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const paramList = generateParam(Controller, route);
  // @ts-ignore
  const instance = new Controller();

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
};
