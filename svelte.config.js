import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-static';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

const production = process.env['NODE_ENV'] == 'production';
console.log('======================================================================================');
console.log('======================================================================================');
console.log('===============================> svelte.config.js mode: ', process.env['NODE_ENV'], '<================');
console.log('======================================================================================');
console.log('======================================================================================');
console.log(import.meta.env);
console.log('======================================================================================');
console.log(process.env['ASSETS_BASE_URL']);
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    appDir: "app",
    paths: { 
      base: process.env['GITHUB_REPO'],//process.env.NODE_ENV === "production" ? "/msClientBuild" : "",
      assets: '', //process.env['GITHUB_REPO_ABS']
    }, 
    target: "#svelte",
    

    adapter: adapter({
    }),
    

    vite: {
      plugins: [
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
