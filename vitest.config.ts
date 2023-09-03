import { UserConfig } from 'vitest';

const config: { test: UserConfig } = {
  test: {
    hookTimeout: 50000,
    testTimeout: 50000,
  },
};

export default config;
