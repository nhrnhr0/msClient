import preprocess from "svelte-preprocess";
import static_adapter from '@sveltejs/adapter-static';
import node_adapter from '@sveltejs/adapter-node';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
//import commonjs from '@rollup/plugin-commonjs';
const production = process.env['NODE_ENV'] == 'production';
console.log('======================================================================================');
console.log('======================================================================================');
console.log('===============================> svelte.config.js mode: ', process.env['NODE_ENV'], '<================');
console.log('======================================================================================');
console.log('======================================================================================');
console.log(import.meta.env);
console.log('======================================================================================');
//console.log(process.env['ASSETS_BASE_URL']);
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    appDir: "app",
    paths: { 
      base: process.env['GITHUB_REPO'],//process.env.NODE_ENV === "production" ? "/msClientBuild" : "",
      assets: '', //process.env['GITHUB_REPO_ABS']
    }, 
    //target: "#svelte",
    /*adapter: static_adapter({}),*/

    adapter: node_adapter({ out: 'build' }),
    

    vite: {
      plugins: [
        //commonjs(),
        babel({ babelHelpers: 'bundled' }),
        production && terser(),
        resolve({
          // Below is the important line!
          dedupe: ['svelte', 'svelte/transition', 'svelte/internal']
        }),
      ],
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: '@import "src/variables.scss";',
          },
        },
      },
    },
  },

  preprocess: [
    preprocess({
      scss: {
        prependData: '@import "src/variables.scss";',
      },
    }),
  ],

  
};

export default config;
