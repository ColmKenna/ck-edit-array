// Rollup configuration for EditArray web component
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

// Base configuration shared between builds
const baseConfig = {
  input: 'src/ck-edit-array.js',
  external: [], // No external dependencies
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: [
                'last 2 Chrome major versions',
                'last 2 Firefox major versions', 
                'last 2 Safari major versions',
                'last 2 Edge major versions',
              ],
            },
            modules: false, // Let Rollup handle modules
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
      ],
    }),
  ],
};

// Development build (unminified)
const devConfig = {
  ...baseConfig,
  output: {
    file: 'dist/ck-edit-array.js',
    format: 'es',
    sourcemap: true,
    banner: `/**
 * EditArray Web Component
 * A web component for editing arrays of structured data
 * @version ${process.env.npm_package_version || '1.0.0'}
 * @license MIT
 */`,
  },
};

// Production build (minified)
const prodConfig = {
  ...baseConfig,
  output: {
    file: 'dist/ck-edit-array.min.js',
    format: 'es',
    sourcemap: true,
    compact: true,
    banner: `/**
 * EditArray Web Component v${process.env.npm_package_version || '1.0.0'}
 * @license MIT
 */`,
  },
  plugins: [
    ...baseConfig.plugins,
    terser({
      compress: {
        drop_console: false, // Keep console.warn and console.error
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
      },
      mangle: {
        properties: {
          regex: /^_/, // Mangle private properties starting with _
        },
      },
      format: {
        comments: /^!|@preserve|@license|@cc_on/i,
      },
    }),
  ],
};

// UMD build for older environments
const umdConfig = {
  ...baseConfig,
  output: {
    file: 'dist/ck-edit-array.umd.js',
    format: 'umd',
    name: 'EditArray',
    sourcemap: true,
    banner: `/**
 * EditArray Web Component (UMD)
 * @version ${process.env.npm_package_version || '1.0.0'}
 * @license MIT
 */`,
  },
  plugins: [
    ...baseConfig.plugins,
    ...(isProduction ? [terser()] : []),
  ],
};

// CommonJS build for Node.js environments
const cjsConfig = {
  ...baseConfig,
  output: {
    file: 'dist/ck-edit-array.cjs',
    format: 'cjs',
    sourcemap: true,
    exports: 'default',
    banner: `/**
 * EditArray Web Component (CommonJS)
 * @version ${process.env.npm_package_version || '1.0.0'}
 * @license MIT
 */`,
  },
};

// Export configurations based on environment
export default isProduction
  ? [devConfig, prodConfig, umdConfig, cjsConfig]
  : [devConfig];