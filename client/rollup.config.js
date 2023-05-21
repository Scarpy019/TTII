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
	// terser()
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
		input: './client/client.ts',
		output: {
			file: './static/lapa/client.js',
			format: 'es'
		},
		plugins: plugins
	},
	{
		input: './client/hardening.ts',
		output: {
			file: './static/js/hardening.js',
			format: 'es'
		},
		plugins: plugins
	},
	{
		input: './client/listing_create/image_handler.ts',
		output: {
			file: './static/lapa/listing_create.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/image_upload.css'})].concat(plugins)
	}
];
