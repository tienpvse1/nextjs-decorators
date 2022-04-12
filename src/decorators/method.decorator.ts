import "reflect-metadata";

export const ROUTES = "routes";
export enum Method {
  GET = "GET",
  PUT = "PUT",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface IRoutes {
  method: Method;
  name: string;
  path: string;
}

export const Get = (path = ""): MethodDecorator => {
  return (target, key) => {
    if (!Reflect.getMetadata(ROUTES, target.constructor)) {
      Reflect.defineMetadata(ROUTES, [], target.constructor);
    }
    const routes: IRoutes[] = Reflect.getMetadata(ROUTES, target.constructor);
    if (path.startsWith("/")) path = path.substring(1);
    if (path.endsWith("/")) path = path.substring(0, path.length - 1);
    routes.push({
      method: Method.GET,
      name: key.toString(),
      path,
    });
    Reflect.defineMetadata(ROUTES, routes, target.constructor);
  };
};
export const Post = (path = ""): MethodDecorator => {
  return (target, key) => {
    if (path.startsWith("/")) path = path.substring(1);
    if (path.endsWith("/")) path = path.substring(0, path.length - 1);
    if (!Reflect.getMetadata(ROUTES, target.constructor)) {
      Reflect.defineMetadata(ROUTES, [], target.constructor);
    }
    const routes: IRoutes[] = Reflect.getMetadata(ROUTES, target.constructor);

    routes.push({
      method: Method.POST,
      name: key.toString(),
      path,
    });
    Reflect.defineMetadata(ROUTES, routes, target.constructor);
  };
};
export const Delete = (path = ""): MethodDecorator => {
  return (target, key) => {
    if (path.startsWith("/")) path = path.substring(1);
    if (path.endsWith("/")) path = path.substring(0, path.length - 1);
    if (!Reflect.getMetadata(ROUTES, target.constructor)) {
      Reflect.defineMetadata(ROUTES, [], target.constructor);
    }
    const routes: IRoutes[] = Reflect.getMetadata(ROUTES, target.constructor);

    routes.push({
      method: Method.DELETE,
      name: key.toString(),
      path,
    });
    Reflect.defineMetadata(ROUTES, routes, target.constructor);
  };
};
export const Patch = (path = ""): MethodDecorator => {
  return (target, key) => {
    if (path.startsWith("/")) path = path.substring(1);
    if (path.endsWith("/")) path = path.substring(0, path.length - 1);
    if (!Reflect.getMetadata(ROUTES, target.constructor)) {
      Reflect.defineMetadata(ROUTES, [], target.constructor);
    }
    const routes: IRoutes[] = Reflect.getMetadata(ROUTES, target.constructor);

    routes.push({
      method: Method.PATCH,
      name: key.toString(),
      path,
    });
    Reflect.defineMetadata(ROUTES, routes, target.constructor);
  };
};
export const Put = (path = ""): MethodDecorator => {
  return (target, key) => {
    if (path.startsWith("/")) path = path.substring(1);
    if (path.endsWith("/")) path = path.substring(0, path.length - 1);
    if (!Reflect.getMetadata(ROUTES, target.constructor)) {
      Reflect.defineMetadata(ROUTES, [], target.constructor);
    }
    const routes: IRoutes[] = Reflect.getMetadata(ROUTES, target.constructor);

    routes.push({
      method: Method.PUT,
      name: key.toString(),
      path,
    });
    Reflect.defineMetadata(ROUTES, routes, target.constructor);
  };
};
