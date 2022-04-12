import "reflect-metadata";
import { autoInjectable, inject } from "tsyringe";
export const Controller = (path = ""): ClassDecorator => {
  return (constructor) => {
    if (path.startsWith("/")) path = path.substring(1);
    if (path.endsWith("/")) path = path.slice(0, -1);
    Reflect.defineMetadata("controller:prefix", path, constructor);
  };
};

export const AutoInject = autoInjectable;
export const Inject = inject;
export const PRISMA_CLIENT = "PrismaClient";
