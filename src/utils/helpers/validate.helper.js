import Joi from "joi";
import {isPlainObject, isArray, isObject, cloneDeep} from "lodash";
import {JOI_DEFAULT_MESSAGE, JOI_DEFAULT_OPTIONS} from "@/configs";
import {AsyncValidate} from "@/utils/types";

export async function validateAsync(schema, data, ...args) {
    let errorDetails = {};

    async function dfs(variable) {
        if (variable instanceof AsyncValidate) {
            variable = await variable.exec(...args);
            if (variable?.prefs) {
                errorDetails[variable.path.join(".")] = `${variable}`;
            }
        } else if (isPlainObject(variable) || isArray(variable)) {
            for (const key in variable) {
                if (isObject(variable[key])) {
                    variable[key] = await dfs(variable[key]);
                }
            }
        }

        return variable;
    }

    let {value, error} = schema.messages(JOI_DEFAULT_MESSAGE).validate(data, {
        ...JOI_DEFAULT_OPTIONS,
        context: {
            data: cloneDeep(data),
        },
    });

    if (error) {
        error = error.details.reduce(function (pre, curr) {
            const path = curr.path.join(".");
            if (!(path in pre)) {
                pre[path] = curr.message;
            }
            return pre;
        }, {});

        errorDetails = error;
    }

    value = await dfs(value);

    return [value, errorDetails];
}

export function tryValidateOrDefault(...args) {
    const defaultValue = args.pop();
    return Joi.alternatives()
        .try(...args, Joi.any().empty(Joi.any()))
        .default(defaultValue);
}
