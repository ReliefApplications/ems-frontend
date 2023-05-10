/** github ref */
const ref = process.env.GITHUB_REF;
/** Name of the branch */
const branch = ref.split('/').pop();
/** If main branch, then use main changelog. Otherwise, use other changelogs. */
const changelog = ['main', 'next', 'next-major'].includes(branch)
  ? 'CHANGELOG.md'
  : `CHANGELOG/CHANGELOG_${branch}.md`;

module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    'next',
    'next-major',
    {
      name: 'beta',
      prerelease: true,
    },
    {
      name: 'alpha',
      prerelease: true,
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: changelog,
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/github',
      {
        successComment: false,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          changelog,
          'package.json',
          'package-lock.json',
          'npm-shrinkwrap.json',
        ],
      },
    ],
  ],
};
