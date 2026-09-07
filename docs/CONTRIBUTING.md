# Contributing

## Branches

| Branch | Environment |
| ------ | ----------- |
| `main` | PROD        |
| `next` | UAT         |
| `beta` | DEV         |

Every change should be done using Pull Requests. Except for PROD hotfixes, in some specific cases, all changes should be done from `next` or `beta`, depending on where we want to do the first release.

## Pull Requests

- The PR template must be filled, providing as much details as possible.
- The name of the branch must use the ID of the [DevOps ticket](https://dev.azure.com/WHOHQ/EMSSAFE/_boards/board/t/App%20Builder%20-%20Core/Stories?System.IterationPath=%40currentIteration) (like `AB#000000`).
- When merging changes, we **must** use squash commits, except when doing merges between the main branches (`main`, `next`, `beta`).
- Commits must follow the patterns defined by [semantic-release](https://github.com/semantic-release/semantic-release), so the version can automatically increase.
