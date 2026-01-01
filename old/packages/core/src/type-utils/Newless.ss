type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type Constructor<T> = {
  [P in keyof T]: T[P] extends (...args: infer A) => infer R
    ? (...args: A) => R
    : never;
};

function defineType<T, U extends FunctionProperties<T>>(
  Interface: Constructor<T>,
  implementation: U
) {
  const Proto = implementation;

  function createInstance(...args: any[]): T {
    return Object.assign(Object.create(Proto), ...args);
  }

  for (const key of Object.keys(implementation)) {
    // @ts-ignore
    createInstance[key] = implementation[key];
  }

  return createInstance as any as Constructor<T> & U;
}
