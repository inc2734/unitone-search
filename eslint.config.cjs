const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	...defaultConfig,
	{
		ignores: [ 'dist/**' ],
	},
	{
		settings: {
			'import/resolver': {
				node: {
					extensions: [
						'.js',
						'.jsx',
						'.ts',
						'.tsx',
						'.d.ts',
						'.mjs',
					],
				},
			},
		},
		rules: {
			'jsx-a11y/label-has-associated-control': 'off',
			'import/no-extraneous-dependencies': 'off',
			'import/no-unresolved': [
				'error',
				{
					ignore: [ '^@wordpress/' ],
				},
			],
			'@wordpress/no-unsafe-wp-apis': 'off',
			eqeqeq: [ 'error', 'allow-null' ],
		},
	},
];
