
import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
    {
        files: ["**/*.{js,jsx}"],
        plugins: {
            react,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            "no-unused-vars": "off",
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off"
        },
    },
];
