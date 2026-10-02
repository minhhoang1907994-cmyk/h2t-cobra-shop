import * as migration_20260924_075227_initial from './20260924_075227_initial';
import * as migration_20260924_082026_split_static_web from './20260924_082026_split_static_web';
import * as migration_20261002_040048_web_deploy_status from './20261002_040048_web_deploy_status';

export const migrations = [
  {
    up: migration_20260924_075227_initial.up,
    down: migration_20260924_075227_initial.down,
    name: '20260924_075227_initial',
  },
  {
    up: migration_20260924_082026_split_static_web.up,
    down: migration_20260924_082026_split_static_web.down,
    name: '20260924_082026_split_static_web',
  },
  {
    up: migration_20261002_040048_web_deploy_status.up,
    down: migration_20261002_040048_web_deploy_status.down,
    name: '20261002_040048_web_deploy_status'
  },
];
