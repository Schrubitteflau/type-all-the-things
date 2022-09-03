
declare const __internalSymbol: unique symbol;

type PrimitiveType = number | string;

type TypeIdentifier<ValueType extends PrimitiveType, Key> = ValueType & {
    __key: Key;
    __primitive: ValueType;
    [__internalSymbol]: true;
};

type InferPrimitive<TID> = TID extends { __primitive: infer Primitive } ? Primitive : never;
type InferKey<TID> = TID extends { __key: infer Key } ? Key : never;

type RuntimeCheckCallback<ValueType extends PrimitiveType> = (value: ValueType) => boolean;
type ErrorMessageCallback<ValueType extends PrimitiveType> = (value: ValueType) => string;

interface TypeHelpers<ValueType extends PrimitiveType, Key extends string> {
    is: (value: ValueType) => value is TypeIdentifier<ValueType, Key>;
    assert: (value: ValueType) => asserts value is TypeIdentifier<ValueType, Key>;
    convert: (value: ValueType) => TypeIdentifier<ValueType, Key>;
}

function rawMakeTypeHelpers<ValueType extends PrimitiveType, Key extends string>(runtimeCheckCb: RuntimeCheckCallback<ValueType>, errorMessageCb: ErrorMessageCallback<ValueType>): TypeHelpers<ValueType, Key>
{
    function typeguardFn(value: ValueType): value is TypeIdentifier<ValueType, Key> {
        return runtimeCheckCb(value);
    };

    function assertFn(value: ValueType): asserts value is TypeIdentifier<ValueType, Key> {
        if (!runtimeCheckCb(value)) {
            throw new Error(errorMessageCb(value));
        }
    };

    function toFn(value: ValueType): TypeIdentifier<ValueType, Key> {
        assertFn(value);
        return value;
    }

    return {
        is: typeguardFn,
        assert: assertFn,
        convert: toFn
    };
}

type Percent = TypeIdentifier<number, "Percent">;

function makeTypeHelpers<TID>()
{
    
}


function makeTypeHelpersFromTypeIdentifier<TID>(): [InferKey<TID>, InferPrimitive<TID>]
{
    return {} as any;
}


// example usage

const aaa = makeTypeHelpersFromTypeIdentifier<Percent>();
