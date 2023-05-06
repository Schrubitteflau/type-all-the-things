export { makeTypeHelpers, nameHelpers, TypeHelpers, NamedHelpers } from "./core";

import type { TypeIdentifier } from "./core";
export type NumericType<Key extends string> = TypeIdentifier<number, Key>;
export type StringType<Key extends string> = TypeIdentifier<string, Key>;
