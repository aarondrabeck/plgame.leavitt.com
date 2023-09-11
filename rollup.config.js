import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import html from '@web/rollup-plugin-html';
import { generateSW } from 'rollup-plugin-workbox';
import copy from 'rollup-plugin-copy';
import path from 'path';
import cleanup from 'rollup-plugin-cleanup';

export default {
  input: 'index.html',
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    format: 'es',
    dir: 'dist',
  },
  preserveEntrySignatures: false,

  plugins: [
    /** Enable using HTML as rollup entrypoint */
    html({
      minify: true,
      injectServiceWorker: false,
      extractAssets: false,
    }),
    /** Resolve bare module imports */
    nodeResolve(),
    /** Compile JS to a lower language target */
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: ['last 3 Chrome major versions', 'last 3 Firefox major versions', 'last 3 Edge major versions', 'last 2 Safari major versions'],
            modules: false,
            bugfixes: true,
          },
        ],
      ],
      plugins: [
        [
          require.resolve('babel-plugin-template-html-minifier'),
          {
            modules: {
              'lit-html': ['html'],
              'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
              lit: ['html', { name: 'css', encapsulation: 'style' }],
            },
            failOnError: false,
            strictCSS: true,
            htmlMinifier: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true,
            },
          },
        ],
      ],
    }),
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' },
        { src: 'sw.js', dest: 'dist' },
        { src: 'manifest', dest: 'dist' },
        { src: 'fonts', dest: 'dist' },
        { src: 'images', dest: 'dist' },
      ],
    }),
    cleanup({
      comments: 'none',
    }),
  ],
};
