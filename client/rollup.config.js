import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import scss from 'rollup-plugin-scss';
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
		input: './client/a/a.ts',
		output: {
			file: './static/exampleA/a.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/exampleA/style.css'})].concat(plugins)
	},
	{
		input: './client/buttonStyling/entry.ts',
		output: {
			file: './static/lapa/lapina.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/lapina.css'})].concat(plugins)
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
