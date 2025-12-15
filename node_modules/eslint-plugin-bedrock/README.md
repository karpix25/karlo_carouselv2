# @bedrockio/eslint-plugin

Common ESLint plugin for Bedrock projects.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-bedrock`:

```
$ npm install @bedrockio/eslint-plugin --save-dev
```


## Usage

You can now extend from `recommended`, `react`, and `jest` configs.
```json
{
    "extends": [
        "plugin:bedrock/recommended",
        "plugin:bedrock/jest",
        "plugin:bedrock/react"
    ]
}
```