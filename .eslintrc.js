module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'  // 解析器，这里我们使用babel-eslint
    },
    "env": {
        "browser": true
    },
    "parserOptions": {
        "sourceType": 'module'
    },
    "parser": "vue-eslint-parser",
    "extends": "eslint:recommended",
    "rules": {
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off"
    }
};