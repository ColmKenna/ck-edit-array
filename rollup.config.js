// Rollup configuration for building the ck-edit-array package
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';
const banner = `/**
 * EditArray Web Component
 * @version ${process.env.npm_package_version ?? '0.0.0'}
 * @license MIT
 */`;

export default {
  input: 'src/ck-edit-array.ts',
  output: [
    {
      file: 'dist/ck-edit-array.js',
      format: 'es',
      sourcemap: true,
      banner
    },
    {
      file: 'dist/ck-edit-array.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      banner
    }
  ],
  plugins: [
    nodeResolve({
      browser: true,
      exportConditions: ['module', 'default']
    }),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        declaration: false,
        declarationMap: false
      }
    }),
    ...(isProduction ? [terser()] : [])
  ]
};
