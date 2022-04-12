import "reflect-metadata";

export enum SupportedDecorators {
  METHOD_PARAM = "method:param",
  QUERY = "method:query",
  BODY = "method:body",
}

export enum SupportedType {
  BODY = "body",
  PARAM = "param",
  QUERY = "query",
}
export interface IParam {
  path?: string;
  index: number;
  type: SupportedType;
  ownerName: string;
}

export const Param = (path: string): ParameterDecorator => {
  return (target, key, index) => {
    if (
      !Reflect.getMetadata(SupportedDecorators.METHOD_PARAM, target.constructor)
    ) {
      Reflect.defineMetadata(
        SupportedDecorators.METHOD_PARAM,
        [],
        target.constructor
      );
    }
    const params: IParam[] = Reflect.getMetadata(
      SupportedDecorators.METHOD_PARAM,
      target.constructor
    );

    params.push({
      path,
      index,
      type: SupportedType.PARAM,
      ownerName: Reflect.getOwnPropertyDescriptor(target, key)?.value.name,
    });
    Reflect.defineMetadata(
      SupportedDecorators.METHOD_PARAM,
      params,
      target.constructor
    );
  };
};
export const Body = (path = ""): ParameterDecorator => {
  return (target, key, index) => {
    if (!Reflect.getMetadata(SupportedDecorators.BODY, target.constructor)) {
      Reflect.defineMetadata(SupportedDecorators.BODY, [], target.constructor);
    }
    const params: IParam[] = Reflect.getMetadata(
      SupportedDecorators.BODY,
      target.constructor
    );
    params.push({
      path,
      index,
      type: SupportedType.BODY,
      ownerName: Reflect.getOwnPropertyDescriptor(target, key)?.value.name,
    });
    Reflect.defineMetadata(
      SupportedDecorators.BODY,
      params,
      target.constructor
    );
  };
};
