import { makeTypeHelpers, NamedHelpers, nameHelpers, NumericType, StringType, TypeHelpers } from "./lib/index";

type Percent = NumericType<"Percent">;
type PositiveInteger = NumericType<"PositiveInteger">;
type IPv4Address = StringType<"IPv4Address">;

const MAKE_TYPE_PARAMS = {
    validate: () => true,
    errorMessage: () => ""
};

const percent = makeTypeHelpers<Percent>(MAKE_TYPE_PARAMS);
const positiveInteger = makeTypeHelpers<PositiveInteger>(MAKE_TYPE_PARAMS);
const ipv4Address = makeTypeHelpers<IPv4Address>(MAKE_TYPE_PARAMS);

// Let's use the named helpers : type-hinting on the function names
const { assertPercent, toPercent, isPercent } = nameHelpers(percent, "Percent");
const { assertIPv4Address, isIPv4Address, toIPv4Address } = nameHelpers(ipv4Address, "IPv4Address");

function workWithPercent(value: Percent): void {}
function workWithPositiveInteger(value: PositiveInteger): void {}
function workWithNumber(value: number): void {}
function workWithIPv4Address(value: IPv4Address): void {}

let p1: Percent = percent.to(1);
let p2: PositiveInteger = positiveInteger.to(1);
let p3: number = 1;
let p4: number = p1;  // OK : a 'Percent' is a number, but a number is not a 'Percent'
let p5: Percent = p4; // Type 'number' is not assignable to type 'Percent'.

workWithPercent(p1)          // OK
workWithPercent(p2);         // Argument of type 'PositiveInteger' is not assignable to parameter of type 'Percent'.
workWithPositiveInteger(p1); // Argument of type 'Percent' is not assignable to parameter of type 'PositiveInteger'.
workWithPositiveInteger(p2); // OK
workWithNumber(p3);          // OK
workWithPercent(p3);         // Argument of type 'number' is not assignable to parameter of type 'Percent'.
workWithPositiveInteger(p3); // Argument of type 'number' is not assignable to parameter of type 'PositiveInteger'.


workWithPositiveInteger(p2); // OK
workWithPercent(p2); // Argument of type 'PositiveInteger' is not assignable to parameter of type 'Percent'.
if (isPercent(p2)) // p2 is 'PositiveInteger'
{
    // p2 is now 'PositiveInteger' & 'Percent'
    // The types derivated from the same primitive type can be combined after explicit checking
    workWithPositiveInteger(p2); // OK
    workWithPercent(p2);         // OK

    // But you can't do that with types derivated from another primitive type
    if (ipv4Address.is(p2))
    {
        // p2 is of type 'never', because p2 can't be a number and a string at the same time
        p2
        workWithIPv4Address(p2); // No error, but since p2 is 'never' we assume that
        // this function call shouldn't happen at runtime
    }

    let p = p2; // The combined type is preserved
    workWithPositiveInteger(p); // OK
    workWithPercent(p);         // OK
}

// Let's play with the other typing features
let s1: string = "";

// There's a bug with assert, it requires explicit type annotation
assertIPv4Address(s1);  // Assertions require every name in the call target to be declared with an explicit type annotation.
ipv4Address.assert(s1); // Assertions require every name in the call target to be declared with an explicit type annotation.

const _ipv4Address: TypeHelpers<IPv4Address> = makeTypeHelpers<IPv4Address>(MAKE_TYPE_PARAMS);
const _ipv4AddressHelpers: NamedHelpers<TypeHelpers<IPv4Address>, "IPv4Address"> = nameHelpers(ipv4Address, "IPv4Address");

_ipv4Address.assert(s1); // OK
_ipv4AddressHelpers.assertIPv4Address(s1); // OK
const { assertIPv4Address: _assertIPv4Address } = _ipv4AddressHelpers;
_assertIPv4Address(s1); // Assertions require every name in the call target to be declared with an explicit type annotation.

// s1 is now of type 'IPv4Address'
workWithIPv4Address(s1); // OK

let s2 = s1; // s2 is 'IPv4Address'

let s3: string = "";
let s4 = ipv4Address.to(s3); // s4 is 'IPv4Address'

// We can't create a structural compatible type, thanks to '__internalSymbol'
declare const __internalSymbol: unique symbol;
type PrimitiveType = number | string;
export type TypeIdentifier<ValueType extends PrimitiveType, Key extends string> = ValueType & {
    __primitive: ValueType;
    [__internalSymbol]: true;
} & Record<Key, true>;

type MyIPv4Address = TypeIdentifier<string, "IPv4Address">;

const s5: MyIPv4Address = s1; // Type 'IPv4Address' is not assignable to type 'MyIPv4Address'.
/*
Property '[__internalSymbol]' is missing in type 'String &
    { __primitive: string; [__internalSymbol]: true; } &
    Record<"IPv4Address", true>'
but required in type '{ __primitive: string; [__internalSymbol]: true; }'.
*/

const s6: MyIPv4Address = {} as any;
const s7: IPv4Address = s6; // Same error : Type 'MyIPv4Address' is not assignable to type 'IPv4Address'.
