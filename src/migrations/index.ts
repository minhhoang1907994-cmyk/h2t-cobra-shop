import * as migration_20260924_075227_initial from './20260924_075227_initial';

export const migrations = [
  {
    up: migration_20260924_075227_initial.up,
    down: migration_20260924_075227_initial.down,
    name: '20260924_075227_initial'
  },
];
