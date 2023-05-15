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
		input: './client/buttonStyling/entry.ts',
		output: {
			file: './static/lapa/headerstyle.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/headerstyle.css'})].concat(plugins)
	},
	{
		input: './client/hardening.ts',
		output: {
			file: './static/js/hardening.js',
			format: 'es'
		}
	}
];
