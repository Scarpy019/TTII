import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import scss from 'rollup-plugin-scss';
import json from "@rollup/plugin-json";
import polyfills from "rollup-plugin-node-polyfills";
const plugins=[
	typescript({ tsconfig: "./client/tsconfig.json", sourceMap: false }),
	commonJS({

	}),
	nodeResolve({
		browser:true
	}),
	json(),
	polyfills(),
	terser()
];

export default [
	{
		input: './client/header/entry.ts', 
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
	},
	{
		input: './client/listing_edit/entry_point.ts',
		output: {
			file: './static/lapa/listing_edit.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/listing_edit.css'})].concat(plugins)
	},
	{
		input: './client/listing_item/entry_point.ts',
		output: {
			file: './static/lapa/listing_item.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/listing_item.css'})].concat(plugins)
	},
	{
		input: './client/listings/entry.ts',
		output: {
			file: './static/lapa/listings.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/listings.css'})].concat(plugins)
	},
	{
		input: './client/subcategories/entry.ts',
		output: {
			file: './static/lapa/subcategories.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/subcategories.css'})].concat(plugins)
	},
	{
		input: './client/sections_mainpage/entry.ts',
		output: {
			file: './static/lapa/mainpage.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/mainpage.css'})].concat(plugins)
	},
	{
		input: './client/chatting.ts',
		output: {
			file: './static/lapa/chatting.js',
			format: 'es'
		},
		plugins: plugins
	},
	{
		input: './client/user/entry.ts',
		output: {
			file: './static/lapa/userpage.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/userpage.css'})].concat(plugins)
	},
	{
		input: './client/search/entry.ts',
		output: {
			file: './static/lapa/search.js',
			format: 'es'
		},
		plugins: [scss({output:'./static/lapa/search.css'})].concat(plugins)
	}
];
