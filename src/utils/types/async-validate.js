import {isEqual} from "lodash";

export class AsyncValidate {
    constructor(value, exec) {
        this.value = value;
        this.exec = exec;
    }

    valueOf() {
        return this.value;
    }

    equals(other, comparator = (x, y) => isEqual(x, y)) {
        if (!(other instanceof AsyncValidate)) {
            return false;
        }
        return comparator(this.value, other.value);
    }
}
