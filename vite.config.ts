import { defineConfig } from 'vitest/config';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
  base: process.env.GITHUB_ACTIONS && repo ? `/${repo}/` : '/',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
