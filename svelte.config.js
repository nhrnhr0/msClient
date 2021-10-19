import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-static';
import { terser } from 'rollup-plugin-terser';

const production = process.env['NODE_ENV'] == 'production';
console.log('======================================================================================');
console.log('======================================================================================');
console.log('===============================> svelte.config.js mode: ', process.env['NODE_ENV'], '<================');
console.log('======================================================================================');
console.log('======================================================================================');
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    paths: { 
      base: '', 
      assets: ''// production ? 'https://nhrnhr0.github.io/msClientBuild' : ''
    }, 
    target: "#svelte",
    

    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    

    vite: {
      plugins: [
        production && terser()
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
