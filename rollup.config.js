import typescript from '@rollup/plugin-typescript'
import { minify } from 'rollup-plugin-esbuild-minify'

const typescriptOptions = {
  outputToFilesystem: false,
  exclude: ['tests/**/*', 'scripts/**/*'],
}

export default [
  {
    external: ['zod'],
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'esm',
    },
    treeshake: {
      annotations: true,
    },
    plugins: [typescript(typescriptOptions)],
  },
  {
    external: ['zod'],
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    treeshake: {
      annotations: true,
    },
    plugins: [typescript(typescriptOptions)],
  },
  {
    external: ['zod'],
    input: 'src/index.ts',
    output: {
      name: 'index',
      file: 'dist/index.min.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins: [
      typescript(typescriptOptions),
      minify({ logLevel: 'debug', logLimit: 100 }),
    ],
  },
]
