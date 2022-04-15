import { IRoutes } from '../decorators/method.decorator';
import { IParam, SupportedDecorators } from '../decorators/param.decorator';

export const generateParam = (Controller: Object, route: IRoutes) => {
  // get all the data from the @Param decorators
  let params: IParam[] =
    Reflect.getMetadata(SupportedDecorators.METHOD_PARAM, Controller) || [];

  // get all the data from the @Body decorators
  let bodies: IParam[] =
    Reflect.getMetadata(SupportedDecorators.BODY, Controller) || [];

  // filter out the data that does not belong to this route
  params = params.filter(item => item.ownerName === route.name);
  bodies = bodies.filter(item => item.ownerName === route.name);

  // the paramList will be passed to the class method
  const paramList = [...params, ...bodies];
  paramList.sort((a, b) => a.index - b.index);
  return paramList;
};
