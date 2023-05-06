# type-all-the-things

The purpose behind this piece of code is to provide an easy and efficient way to bind a primitive value to a static type. The value is not wrapped, which means nothing will change at runtime, the value will still be a primitive value. The way it works is simple :
1. You explicitely declare your new type, for example `Percent`, which purpose is to hold an integer between 0 and 100. I'll now refer to this kind of type as a `validation bounded type`, or `VBT`
2. You create and link a validation function to the type
3. You're good to go ! Start frenzy typing :)

See `index.ts` for a complete example and a way to get started, and `test_typing.ts` to make sure the typing behaviour is correct.

Each VBT has the following properties :
- It is only compatible with itself
- It is stackable

## Only compatible with itself

A variable of a specific VBT can only receive a value of the same VBT. For example :
```ts
type GmailEmail = StringType<"GmailEmail">;
type OutlookEmail = StringType<"OutlookEmail">;
let e: GmailEmail = "" as OutlookEmail;
// Type 'OutlookEmail' is not assignable to type 'GmailEmail'.
```

But, it is possible to assign a VBT value to a variable of the corresponding primitive type :
```ts
let e: string = "" as OutlookEmail; // Works
let p: string = 1 as Percent; // Type 'Percent' is not assignable to type 'string'.
```

## Stackable

You can use an intersection to force a value to be compatible with several VBT :
```ts
function workWithLongEmail(value: Email & LongString): void {
    console.log(`The string '${value}' is an email and a long string at the same time !`);
}

const myString: string = "aaaaaaaaaa@aaaaa.com";
if (isEmail(myString)) {
    workWithEmail(myString); // Works
    //workWithLongString(myString); // Argument of type 'Email' is not assignable to parameter of type 'LongString'.
    //workWithLongEmail(myString); // Argument of type 'Email' is not assignable to parameter of type ...

    if (isLongString(myString)) {
        workWithLongString(myString); // Works
        workWithLongEmail(myString); // Works
    }
}
```

## Possible improvements

Since this side project should be seen as a proof of concept, there are many ways to improve it, assuming that there is a real use case.
- Make the VBTs composable, to combine them and prevent code duplication
- Integrate basic built-in VBTs, that are the most common. An example could be `PositiveInteger`

## Final words

Thanks for reading me ! Don't hesitate to open an issue for any suggestion or question !