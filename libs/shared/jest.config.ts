/* eslint-disable */
export default {
  displayName: 'shared',
  preset: '../../jest.preset.js',
  setupFiles: [`../../jest-shim.ts`],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../coverage/libs/shared',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)',
    '<rootDir>/node_modules/(?!lodash-es)',
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
  // Manually add valid tests there
  testMatch: [
    '<rootDir>/src/lib/services/context/*.spec.ts',
    '<rootDir>/src/lib/services/html-parser/*.spec.ts',
    '<rootDir>/src/lib/pipes/asset/*.spec.ts',
    '<rootDir>/src/lib/pipes/gradient/*.spec.ts',
  ],
};
