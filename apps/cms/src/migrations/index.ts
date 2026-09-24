import * as migration_20260924_075227_initial from './20260924_075227_initial';
import * as migration_20260924_082026_split_static_web from './20260924_082026_split_static_web';

export const migrations = [
  {
    up: migration_20260924_075227_initial.up,
    down: migration_20260924_075227_initial.down,
    name: '20260924_075227_initial',
  },
  {
    up: migration_20260924_082026_split_static_web.up,
    down: migration_20260924_082026_split_static_web.down,
    name: '20260924_082026_split_static_web'
  },
];
