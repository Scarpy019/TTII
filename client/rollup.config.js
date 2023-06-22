import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import scss from 'rollup-plugin-scss';
import json from "@rollup/plugin-json";
import polyfills from "rollup-plugin-node-polyfills";
const plugins=[
	typescript({ tsconfig: "./client/tsconfig.json", sourceMap: true }),
	commonJS({

	}),
	nodeResolve({
		browser:true
	}),
	json(),
	polyfills()
	// terser()
];

export default [
	{
		input: './client/buttonStyling/entry.ts',
		output: {
			sourceMap: true,
			file: './static/lapa/headerstyle.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/headerstyle.css'})].concat(plugins)
	},
	{
		input: './client/client.ts',
		output: {
			sourceMap: true,
			file: './static/lapa/client.js',
			format: 'es'
		},
		plugins: plugins
	},
	{
		input: './client/hardening.ts',
		output: {
			sourceMap: true,
			file: './static/js/hardening.js',
			format: 'es'
		},
		plugins: plugins
	},
	{
		input: './client/listing_create/image_handler.ts',
		output: {
			sourceMap: true,
			file: './static/lapa/listing_create.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/image_upload.css'})].concat(plugins)
	},
	{
		input: './client/listing_edit/entry_point.ts',
		output: {
			sourceMap: true,
			file: './static/lapa/listing_edit.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/listing_edit.css'})].concat(plugins)
	},
	{
		input: './client/listing_item/entry_point.ts',
		output: {
			sourceMap: true,
			file: './static/lapa/listing_item.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/listing_item.css'})].concat(plugins)
		input: './client/chatting.ts',
		output: {
			file: './static/lapa/chatting.js',
			format: 'es'
		},
		plugins: plugins
	}
];
