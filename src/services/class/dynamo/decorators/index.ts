export function validateProperties(properties: string[]) {
  return function (
    _: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const [input] = args;

      for (const prop of properties) {
        if (!input || !input[prop]) {
          throw new Error(`${prop} is required for method ${propertyKey}`);
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
