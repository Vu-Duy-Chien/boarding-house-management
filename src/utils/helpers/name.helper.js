import _ from "lodash";

export const capitalizeName = (name) => {
    const words = name.trim().split(" ");
    const capitalizedWords = words.map((word) => _.capitalize(word)).filter((word) => word !== "");
    return capitalizedWords.join(" ");
};

export const validateName = (value, helpers) => {
    const invalidCharIndex = [...value].findIndex(
        (c) => !/\s+/.test(c) && c.toLowerCase() === c.toUpperCase()
    );
    return invalidCharIndex < 0 ? value : helpers.message("Họ và tên không bao gồm số hoặc ký tự đặc biệt.");
};
