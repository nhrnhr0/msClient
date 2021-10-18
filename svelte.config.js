import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-static';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  plugins: [
		production && terser()
  ],
  kit: {
    paths: { 
      base: '', 
      assets: process.env.NODE_ENV === 'production' ? 'https://nhrnhr0.github.io/msClientBuild' : ''
    }, 
    target: "#svelte",
    

    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    

    vite: {
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
