import 'reflect-metadata';
import { autoInjectable, inject } from 'tsyringe';

export const CONTROLLER_PREFIX = 'CONTROLLER_PREFIX';
export const Controller = (path = ''): ClassDecorator => {
  return constructor => {
    if (path.startsWith('/')) path = path.substring(1);
    if (path.endsWith('/')) path = path.slice(0, -1);
    Reflect.defineMetadata(CONTROLLER_PREFIX, path, constructor);
  };
};

export const AutoInject = autoInjectable;
export const Inject = inject;
export const PRISMA_CLIENT = 'PrismaClient';
