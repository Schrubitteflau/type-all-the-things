
declare const __internalSymbol: unique symbol;

type PrimitiveType = number | string;

type StrictType<Primitive extends PrimitiveType, UniqueKey extends string> = Primitive & {
    __key: UniqueKey;
    [__internalSymbol]: true;
}


type NegativeInteger = StrictType<number, "NegativeInteger">;


type ValidityCallback<Primitive extends PrimitiveType> = (value: Primitive) => boolean;

interface CreateStrictTypeReturn<Primitive extends PrimitiveType, UniqueKey extends string> {
    __typeguard: (value: Primitive) => value is StrictType<Primitive, UniqueKey>;
    __assert: (value: Primitive) => asserts value is StrictType<Primitive, UniqueKey>;
    //to: (value: Primitive) => StrictType<Primitive, UniqueKey>;
}

function createStrictType<Primitive extends PrimitiveType, UniqueKey extends string>(validityCallback: ValidityCallback<Primitive>): CreateStrictTypeReturn<Primitive, UniqueKey>
{
    function typeguardFn(value: Primitive): value is StrictType<Primitive, UniqueKey> {
        return validityCallback(value);
    };

    function assertFn(value: Primitive): asserts value is StrictType<Primitive, UniqueKey> {
        if (!validityCallback(value)) {
            throw new Error("aaa");
        }
    };

    /*const toFn = (value: Primitive): StrictType<Primitive, UniqueKey> => {
        assertFn(value);
        //const b = value;
        //return value;
    }*/

    return {
        __typeguard: typeguardFn,
        __assert: assertFn
    };
}


const sss: CreateStrictTypeReturn<number, "PositiveInteger"> = createStrictType<number, "PositiveInteger">((value: number) => {
    return value > 0;
});

const a: number = 1;
if (sss.__typeguard(a))
{
    const b = a;
}
else
{
    const c = a;
}

const d: number = 1;
sss.__assert(d);
let e = d; // inferred as StrictType<number, "PositiveInteger">
e = 1;
