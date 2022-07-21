type Primitive = string | Function | number | boolean | symbol | undefined | null;

type DeepOmitArray<T extends unknown[], K> = {
  [P in keyof T]: DeepOmit<T[P], K>;
};

export type DeepOmit<T, K> = T extends Primitive
  ? T
  : {
      [P in Exclude<keyof T, K>]?: T[P] extends infer TP
        ? TP extends Primitive
          ? TP
          : TP extends unknown[]
          ? DeepOmitArray<TP, K>
          : DeepOmit<TP, K>
        : never;
    };

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
