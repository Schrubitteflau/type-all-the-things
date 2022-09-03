import { makeTypeHelpers, nameHelpers, NumericType } from "./lib/index";

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

console.log(percent.is === isPercent);

