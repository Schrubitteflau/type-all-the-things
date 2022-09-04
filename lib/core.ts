
declare const __internalSymbol: unique symbol;

type PrimitiveType = number | string;

export type TypeIdentifier<ValueType extends PrimitiveType, Key extends string> = ValueType & {
    __primitive: ValueType;
    [__internalSymbol]: true;
} & Record<Key, true>;

type TIDPrimitive<TID> = TID extends { __primitive: infer Primitive } ? Primitive : never;

type RuntimeCheckCallback<TID> = (value: TIDPrimitive<TID>) => boolean;
type ErrorMessageCallback<TID> = (value: TIDPrimitive<TID>) => string;

export interface TypeHelpers<TID> {
    is: (value: any) => value is TID;
    assert: (value: any) => asserts value is TID;
    from: (value: any) => TID;
}

export type NamedHelpers<Helpers extends TypeHelpers<any>, Name extends string> = {
    [Property in keyof Helpers as `${Property & string}${Name}`]: Helpers[Property];
}

export interface MakeTypeHelpersParams<TID> {
    validate: RuntimeCheckCallback<TID>;
    errorMessage: ErrorMessageCallback<TID>;
}

export function makeTypeHelpers<TID extends TypeIdentifier<any, any>>({ validate, errorMessage }: MakeTypeHelpersParams<TID>): TypeHelpers<TID>
{
    function typeguardFn(value: any): value is TID {
        return validate(value);
    };

    function assertFn(value: any): asserts value is TID {
        if (!validate(value)) {
            throw new Error(errorMessage(value));
        }
    };

    function fromFn(value: any): TID {
        assertFn(value);
        return value;
    }

    return {
        is: typeguardFn,
        assert: assertFn,
        from: fromFn
    };
}

export function nameHelpers<Helpers extends TypeHelpers<any>, Name extends string>(helpers: Helpers, name: Name): NamedHelpers<Helpers, Name>
{
    const ret: any = {};

    for (const [propertyName, callback] of Object.entries(helpers))
    {
        ret[`${propertyName}${name}`] = callback
    }

    return ret;
}
