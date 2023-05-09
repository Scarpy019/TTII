import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const plugins=[
	
	typescript({ tsconfig: "./client/tsconfig.json" }),
	commonJS({

	}),
	nodeResolve({
		browser:true
	}),
	terser()
]

export default [
	{
		input: './client/a.ts',
		output: {
			file: './static/js/a.js',
			format: 'es'
		},
		plugins: plugins
	},
	{
		input: './client/b.ts',
		output: [
			{
				file: './static/js/b1.js',
				format: 'es'
			}
		],
		plugins: plugins
	}
];
