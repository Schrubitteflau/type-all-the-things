
function createNumericType<Key extends string>(runtimeCheckFn: RuntimeCheckCallback<number>)
{
    return createStrictType<number, Key>(runtimeCheckFn);
}


const positiveInteger: StrictType<number, "PositiveInteger"> = createNumericType<"PositiveInteger">((value: number) => {
    return value > 0;
});

const a: number = 1;
if (positiveInteger.is(a))
{
    const b = a;
}
else
{
    const c = a;
}

const d: number = 1;
positiveInteger.assert(d);
let e = d; // inferred as StrictType<number, "PositiveInteger">
e = 1;
