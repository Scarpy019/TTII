import typescript from "@rollup/plugin-typescript";


export default [
	{
		input: './client/a.ts',
		output: {
			file: './static/js/a.js',
			format: 'es'
		},
		plugins: [typescript({ tsconfig: "./client/tsconfig.json" })]
	},
	{
		input: './client/b.ts',
		output: [
			{
				file: './static/js/b1.js',
				format: 'es'
			}
		],
		plugins: [typescript({ tsconfig: "./client/tsconfig.json" })]
	}
];
