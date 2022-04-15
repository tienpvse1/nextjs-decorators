import { match } from 'path-to-regexp';
import { CONTROLLER_PREFIX } from '../decorators/controller.decorator';
import { IRoutes } from '../decorators/method.decorator';

export const checkRoute = (Controller: Object, route: IRoutes, url: string) => {
  const path: string = Reflect.getMetadata(CONTROLLER_PREFIX, Controller);

  // the full api url is concat with the controller prefix with the route prefix
  let fullPath = '/' + path;
  if (route.path.length > 0) {
    fullPath += '/' + route.path;
  }

  // create the matchUrl instance to check if the request url match with the url of the route
  const matchUrl = match(fullPath, { decode: decodeURIComponent });
  return matchUrl(url);
};
