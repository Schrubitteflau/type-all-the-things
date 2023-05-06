import joi from "joi";

import { makeTypeHelpers, nameHelpers, NumericType, StringType } from "./lib/index";

type Percent = NumericType<"Percent">;

const percent = makeTypeHelpers<Percent>({
    errorMessage(value) {
        return `Value should be between 0 and 100, received ${value}`;
    },
    validate(value: any) {
        return (typeof(value) === "number" && value >= 0 && value <= 100);
    }
});

const { isPercent } = nameHelpers(percent, "Percent");

console.log("percent.is === isPercent", percent.is === isPercent); // true

function workWithPercent(value: Percent) {
    console.log(`[workWithPercent] => ${value}`);
}

const myNumber: number = 10;
if (isPercent(myNumber)) {
    workWithPercent(myNumber); // [workWithPercent] => 10
}

try {
    const notAPercent: number = -1;
    workWithPercent(percent.from(notAPercent));
} catch (e) {
    console.log((e as Error).message); // Error: Value should be between 0 and 100, received -1
}

/* Since this library only provides a way to link runtime checks to staticly typed primitive types, it is
possible to use any 3rd party validation library, such as Joi */
function joiAdapter(schema: joi.StringSchema) {
    return (value: any) => typeof(schema.validate(value).error) === "undefined";
}

// First, let's create the validation function
const validateIsEmail = joiAdapter(joi.string().email());
// Then, let's create the type
type Email = StringType<"Email">;
// Finally, let's make the type helpers functions to handle this type
const emailHelpers = makeTypeHelpers<Email>({
    validate: validateIsEmail,
    errorMessage(value) {
        return `'${value}' is not a valid email address`;
    }
});

try {
    const email: Email = emailHelpers.from("baguette@paris.org");
    console.log(email, typeof email); // 'baguette@paris.org' string
    const notAnEmail: Email = emailHelpers.from("not an email");
} catch (e) {
    console.log((e as Error).message); // 'not an email' is not a valid email address
}

type LongString = StringType<"LongString">;
// Finally, let's make the type helpers functions to handle this type
const longStringHelpers = makeTypeHelpers<LongString>({
    validate: joiAdapter(joi.string().min(20)),
    errorMessage(value) {
        return `'${value}' is not a long string`;
    }
});

function workWithEmail(value: Email): void {
    console.log(`The string '${value}' is an email !`);
}
function workWithLongString(value: LongString): void {
    console.log(`The string '${value}' is a long string !`);
}

// This function accepts a parameter which is an email address and a long string at the same time
function workWithLongEmail(value: Email & LongString): void {
    console.log(`The string '${value}' is an email and a long string at the same time !`);
}

const { isLongString } = nameHelpers(longStringHelpers, "LongString");
const { isEmail } = nameHelpers(emailHelpers, "Email");

const myString: string = "aaaaaaaaaa@aaaaa.com";

// Let's try to combine two different types, but with the same underlying primitive

if (isEmail(myString)) {
    workWithEmail(myString); // OK
    //workWithLongString(myString); // Argument of type 'Email' is not assignable to parameter of type 'LongString'.
    //workWithLongEmail(myString); // Argument of type 'Email' is not assignable to parameter of type ...

    if (isLongString(myString)) {
        workWithLongString(myString); // OK
        workWithLongEmail(myString); // OK
    }
}

if (isLongString(myString)) {
    workWithLongString(myString); // OK
    //workWithEmail(myString); // Argument of type 'LongString' is not assignable to parameter of type 'Email'.
    //workWithLongEmail(myString); // Argument of type 'LongString' is not assignable to parameter of type ...

    if (isEmail(myString)) {
        workWithEmail(myString); // OK
        workWithLongEmail(myString); // OK
    }
}

myString // Hover and check the type : string

// So, this combination works :
if (isEmail(myString) && isLongString(myString)) {
    workWithEmail(myString);
    workWithLongString(myString);
    workWithLongEmail(myString);
}

// The expected console output is the following :
/*
The string 'aaaaaaaaaa@aaaaa.com' is an email !
The string 'aaaaaaaaaa@aaaaa.com' is a long string !
The string 'aaaaaaaaaa@aaaaa.com' is an email and a long string at the same time !
The string 'aaaaaaaaaa@aaaaa.com' is a long string !
The string 'aaaaaaaaaa@aaaaa.com' is an email !
The string 'aaaaaaaaaa@aaaaa.com' is an email and a long string at the same time !
The string 'aaaaaaaaaa@aaaaa.com' is an email !
The string 'aaaaaaaaaa@aaaaa.com' is a long string !
The string 'aaaaaaaaaa@aaaaa.com' is an email and a long string at the same time !
*/
