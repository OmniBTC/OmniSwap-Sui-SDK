import typescript from '@rollup/plugin-typescript';

var rollup_config = [
  {
    input: 'src/main.ts',
    output: [
      {
        file: './dist/main.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: './dist/main.mjs',
        format: 'es',
        sourcemap: true
      }
    ],
    external: ['@mysten/sui.js', 'commander', 'fs', 'yaml', 'decimal.js'],
    plugins: [typescript()]
  }
];
export { rollup_config as default };
