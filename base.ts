
declare const __internalSymbol: unique symbol;

type PrimitiveType = number | string;

type TypeIdentifier<ValueType extends PrimitiveType, Key extends string> = ValueType & {
    __key: Key;
    __primitive: ValueType;
    [__internalSymbol]: true;
};

type TIDPrimitive<TID> = TID extends { __primitive: infer Primitive } ? Primitive : never;
type TIDKey<TID> = TID extends { __key: infer Key } ? Key : never;

type RuntimeCheckCallback<TID> = (value: TIDPrimitive<TID>) => boolean;
type ErrorMessageCallback<TID> = (value: TIDPrimitive<TID>) => string;

interface TypeHelpers<TID> {
    is: (value: any) => value is TID;
    assert: (value: any) => asserts value is TID;
    convert: (value: any) => TID;
    primitive: (value: TID) => TIDPrimitive<TID>;
}

function makeTypeHelpers<TID extends TypeIdentifier<any, any>>(runtimeCheckCb: RuntimeCheckCallback<TID>, errorMessageCb: ErrorMessageCallback<TID>): TypeHelpers<TID>
{
    function typeguardFn(value: any): value is TID {
        return runtimeCheckCb(value);
    };

    function assertFn(value: any): asserts value is TID {
        if (!runtimeCheckCb(value)) {
            throw new Error(errorMessageCb(value));
        }
    };

    function toFn(value: any): TID {
        assertFn(value);
        return value;
    }

    function primitiveFn(value: TID): TIDPrimitive<TID> {
        return value as TIDPrimitive<TID>;
    }

    return {
        is: typeguardFn,
        assert: assertFn,
        convert: toFn,
        primitive: primitiveFn
    };
}

// ---

type NumericType<Key extends string> = TypeIdentifier<number, Key>;


type Percent = NumericType<"Percent">;
type PositiveInteger = NumericType<"PositiveInteger">;

const percent = makeTypeHelpers<Percent>(() => true, () => "");

let p1: Percent = 1 as any
let p2: PositiveInteger = 1 as any
let p3: number = 1
let p4: number = p1

if (percent.is(p2))
{
    p2
}
