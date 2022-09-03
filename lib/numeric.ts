import { TypeIdentifier } from "./core";

export type NumericType<Key extends string> = TypeIdentifier<number, Key>;

// TODO : add wrapping numeric test : (typeof value === "number")
