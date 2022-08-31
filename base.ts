
declare const __internalSymbol: unique symbol;

type PrimitiveType = number | string;

type TypeIdentifier<ValueType extends PrimitiveType, Key extends string> = ValueType & {
    __key: Key;
    [__internalSymbol]: true;
}

type RuntimeCheckCallback<ValueType extends PrimitiveType> = (value: ValueType) => boolean;

interface TypeHelpers<ValueType extends PrimitiveType, Key extends string> {
    is: (value: ValueType) => value is TypeIdentifier<ValueType, Key>;
    assert: (value: ValueType) => asserts value is TypeIdentifier<ValueType, Key>;
    convert: (value: ValueType) => TypeIdentifier<ValueType, Key>;
}

function createStrictType<ValueType extends PrimitiveType, Key extends string>(runtimeCheckFn: RuntimeCheckCallback<ValueType>): TypeHelpers<ValueType, Key>
{
    function typeguardFn(value: ValueType): value is TypeIdentifier<ValueType, Key> {
        return runtimeCheckFn(value);
    };

    function assertFn(value: ValueType): asserts value is TypeIdentifier<ValueType, Key> {
        if (!runtimeCheckFn(value)) {
            throw new Error("aaa");
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
