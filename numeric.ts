type NumericType<Key extends string> = TypeIdentifier<number, Key>;
type NumericHelpers<Key extends string> = TypeHelpers<number, Key>;

type PositiveInteger = NumericType<"PositiveInteger">;

// ajouter l'option où on utilise PositiveInteger et ça infer la key et du coup on peut manipuler
// des PositiveInteger au lieu de NumericType<"PositiveInteger"> !!

const createNumericType: (typeof createStrictType)<number, ""> = createStrictType;

const PositiveInteger: NumericHelpers<"PositiveInteger"> = createNumericType<"PositiveInteger">((value: number) => {
    return value > 0;
}, (val) => "NONONONONONO");

const a: number = 1;
if (PositiveInteger.is(a))
{
    const b: NumericType = a;
}
else
{
    const c = a;
}

const d: number = 1;
PositiveInteger.assert(d);
let e = d; // inferred as StrictType<number, "PositiveInteger">
e = 1;