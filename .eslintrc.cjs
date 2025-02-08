module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		project: "./tsconfig.json",
		tsconfigRootDir: __dirname,
	},
	overrides: [
		{
			files: ["*.js", "*.cjs"],
			parserOptions: {
				project: "./tsconfig.node.json",
			},
		},
	],
	plugins: ["@typescript-eslint", "@stylistic/eslint-plugin-ts"],
	extends: [
		"airbnb-typescript",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		// "plugin:@stylistic/eslint-plugin-ts",
	],
	env: {
		browser: true,
		es2020: true,
		node: true,
	},
	rules: {
		// "@stylistic/ts/indent": ["error", "tab"],
		"@typescript-eslint/quotes":"off",
		"@typescript-eslint/indent":"off",
		"react/jsx-filename-extension": "off",
		"import/extensions": "off",
		"import/no-extraneous-dependencies": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-argument": "off",
		"@typescript-eslint/no-unsafe-return": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		// "@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/ban-ts-comment": "error",
	},
};
