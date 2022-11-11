// rollup.config.js
import typescript from '@rollup/plugin-typescript';

var rollup_config = [
  {
    input: 'src/cli/index.ts',
    output: [
      {
        file: './cli/index.js',
        format: 'cjs',
        sourcemap: true
      }
    ],
    external: ['@mysten/sui.js', 'commander', 'fs', 'yaml', 'big-integer'],
    plugins: [typescript()]
  }
];
export { rollup_config as default };
