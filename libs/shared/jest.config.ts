/* eslint-disable */
export default {
  displayName: 'shared',
  preset: '../../jest.preset.js',
  setupFiles: [`../../jest-shim.ts`],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  coverageDirectory: '../../coverage/libs/shared',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
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
    '<rootDir>/src/lib/services/auto-translate/*.spec.ts',
    '<rootDir>/src/lib/services/context/*.spec.ts',
    '<rootDir>/src/lib/services/file/*.spec.ts',
    '<rootDir>/src/lib/services/html-parser/*.spec.ts',
    '<rootDir>/src/lib/services/grid/*.spec.ts',
    '<rootDir>/src/lib/services/map/map-layers.service.spec.ts',
    '<rootDir>/src/lib/pipes/asset/*.spec.ts',
    '<rootDir>/src/lib/pipes/gradient/*.spec.ts',
    '<rootDir>/src/lib/pipes/readable-history-value/*.spec.ts',
    '<rootDir>/src/lib/components/layout/layout.component.spec.ts',
    '<rootDir>/src/lib/components/language-switch/language-switch.component.spec.ts',
    '<rootDir>/src/lib/components/record-history/*.spec.ts',
    '<rootDir>/src/lib/components/widgets/common/tab-actions/*.spec.ts',
    '<rootDir>/src/lib/components/widgets/common/tab-actions/read-only-fields-modal/*.spec.ts',
    '<rootDir>/src/lib/models/*.spec.ts',
    '<rootDir>/src/lib/survey/global-properties/*.spec.ts',
    '<rootDir>/src/lib/utils/*.spec.ts',
    '<rootDir>/src/lib/utils/filter/*.spec.ts',
    '<rootDir>/src/lib/survey/components/resources.spec.ts',
    '<rootDir>/src/lib/survey/components/utils/*.spec.ts',
    '<rootDir>/src/lib/survey/widgets/*.spec.ts',
    '<rootDir>/src/lib/utils/*.spec.ts',
    '<rootDir>/src/lib/survey/triggers/*.spec.ts',
  ],
};
