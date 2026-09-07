# WHO App Builder front-end

# Versions

| Branch | Version                                                                                                                                 | CI                                                                                                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| main   | ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/ReliefApplications/ems-frontend/main)              | [![Version](https://github.com/ReliefApplications/ems-frontend/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ReliefApplications/ems-frontend/actions/workflows/ci.yml) |
| next   | ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/ReliefApplications/ems-frontend/next?color=6ded5a) | [![Version](https://github.com/ReliefApplications/ems-frontend/actions/workflows/ci.yml/badge.svg?branch=next)](https://github.com/ReliefApplications/ems-frontend/actions/workflows/ci.yml) |
| beta   | ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/ReliefApplications/ems-frontend/beta?color=ecf495) | [![Version](https://github.com/ReliefApplications/ems-frontend/actions/workflows/ci.yml/badge.svg?branch=beta)](https://github.com/ReliefApplications/ems-frontend/actions/workflows/ci.yml) |

# Introduction

This front-end was made using [Angular](https://angular.io/). It uses multiple external packages, but the relevant ones are:

- [KendoUI Angular](https://www.telerik.com/kendo-angular-ui), for the widgets of the dashboards
- [SurveyJS](https://surveyjs.io/), for the form builder
- [Apollo Angular](https://www.apollographql.com/docs/angular/), as a GraphQL client, to interact with the back-end

It was made for a Proof of Concept of a UI Builder for WHO.

On top of Angular, [Nx](https://nx.dev/) was installed, to better split projects and libs.

# Setup

Install the dependencies:

```
npm i
```

# General

The project is separated into three sub-projects:

- back-office, an application accessible to administrators
- front-office, an application that would depend on the logged user
- web-widgets, an application to generate the web components

Several libraries exist:

- shared, a library for common ui / capacity, shared with other projects
- ui, a library of generic ui components
- styles, a library with shared styles
- doc-management, a library for document management

Library changes should automatically be detected when serving the other projects.

# Infrastructure & deployment

Infrastructure and deployment are managed in the [emssafe-infra](https://dev.azure.com/WHOHQ/EMSSAFE/_git/emssafe-infra) repository. Please refer to it for instructions.

# Contributing

Please refer to the [contribution guide](docs/CONTRIBUTING.md) for branching strategy and Pull Request rules.

# Useful commands

## Development server

To serve a project, run:

```
npx nx run <project>:serve:<config>
```

Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files.

For example:

```
npx nx run back-office:serve
```

will serve back-office with default development configuration.

```
npx nx run back-office:serve:local-dev
```

will serve back-office, connecting to the deployed dev back-end. Other available serve configurations are `local-uat` and `local-prod`, to connect to the deployed uat / prod back-ends.

The makefile also provides shortcuts to serve each application with an increased memory limit:

```
make serve-back
make serve-front
make serve-widgets
```

## Code scaffolding

Generate a component:

```
npx nx g component <component-name>
```

Generate a module:

```
npx nx g module <module-name>
```

You can also use `npx nx generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npx nx run <project>:build:<config>` to build a project. The build artifacts will be stored in the `dist/apps/` directory.

## Prettify scss and html

Run `npx prettier --write "**/*.{scss,html}"` (or `make prettify`) to execute prettier and update all scss / html files locally.

## Analyze bundle

Start by building apps adding `--statsJson` flag. For example:

```
npx nx run back-office:build --statsJson
```

Then, run `webpack-bundle-analyzer` command to see the tree of your bundles:

```
npx webpack-bundle-analyzer dist/apps/back-office/stats.json
```

## Storybook

The ui, shared and doc-management libraries have their own storybook definitions. To execute a storybook locally, you can run:

```
npx nx run <library>:storybook
```

For example:

```
npx nx run ui:storybook
```

To build it, you can run:

```
npx nx run <library>:build-storybook
```

Pushing the code on the repo should automatically deploy storybook on a public environment.

## Web components

To test web components, you can:

- go to this repo: https://github.com/ReliefApplications/app-builder-widgets-poc
- Switch to the branch: https://github.com/ReliefApplications/app-builder-widgets-poc/tree/fix/68747_add_forms_and_missing_styles_file
- execute: `npm i && npm run start`
  You should find under the form widget dropdown some form types in order to test the form web component.

### Build the web components

You can use the makefile command:

```
make bundle-widgets
```

By default, the target is azure-dev project, but you can change it like that:

```
make bundle-widgets project=azure-prod
```

The command will generate a file under the `widgets` folder, called `app-builder.js`.
This is the file you'll need to deploy on Azure blob storage to provide the code.

If web-widgets is already built, you can regenerate the bundle without rebuilding by running:

```
make build-widgets
```

If you need to upload files to the blob storage where we store shared assets, you can use the az commands.
First, build the front-office in production mode ( any environment, but same version ).
Then, run:

az storage blob upload-batch --destination {container} --account-name {accountname} --destination-path {path-to-folder-in-container} --source {path-to-folder-locally}

# Common issues

## Javascript heap out of memory

In case you encounter any memory issue, open your terminal and type following command, depending on your vscode terminal.
You should then be able to pass your commands as before.

### Bash

```
export NODE_OPTIONS="--max-old-space-size=4096"
```

In case you still face issues, you can still increase it:

```
export NODE_OPTIONS="--max-old-space-size=8192"
```

### Powershell

```
set NODE_OPTIONS="--max-old-space-size=4096"
```

In case you still face issues, you can still increase it:

```
set NODE_OPTIONS="--max-old-space-size=8192"
```
