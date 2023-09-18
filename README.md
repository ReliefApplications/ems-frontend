OORT Front-end
=======
[![Github Pages](https://github.com/ReliefApplications/oort-frontend/actions/workflows/github-pages.yml/badge.svg)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/github-pages.yml)
[![Storybook](https://github.com/ReliefApplications/oort-frontend/actions/workflows/storybook.yml/badge.svg)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/storybook.yml)

# Versions

Branch | Version | CI
--- | --- | ---
main | ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/ReliefApplications/oort-frontend/main) | [![Version](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml)
next | ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/ReliefApplications/oort-frontend/next?color=6ded5a) | [![Version](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml/badge.svg?branch=next)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml)
beta | ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/ReliefApplications/oort-frontend/beta?color=ecf495) | [![Version](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml/badge.svg?branch=beta)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml)

# Introduction

This front-end was made using [Angular](https://angular.io/). It uses multiple external packages, but the relevant ones are:

*   [KendoUI Angular](https://www.telerik.com/kendo-angular-ui), for the widgets of the dashboards
*   [SurveyJS](https://surveyjs.io/), for the form builder
*   [Apollo Angular](https://www.apollographql.com/docs/angular/), as a GraphQL client, to interact with the back-end

It was made for a Proof of Concept of a UI Builder for WHO.

To read more about the project, and how to setup the back-end, please refer to the [documentation of the project](https://gitlab.com/who-ems/ui-doc).

*   [Setup](https://gitlab.com/who-ems/ui-doc#how-to-setup)
*   [Deployment](https://gitlab.com/who-ems/ui-doc#how-to-deploy)

In top of Angular, [Nx](https://nx.dev/) was installed, to better split projects and libs.


# General

The project is seperated into three sub-projects:
- back-office, an application accessible to administrators
- front-office, an application that would depend on the logged user
- web-widgets, an application to genereate the web components

One library exists:
- safe, a library for common ui / capacity, shared with other projects

Library changes should automatically be detected when serving the other projects.

# Azure configuration

If you want to deploy on Azure, build back-office and front-office:
```
npx nx run back-office:build:azure-dev
npx nx run front-office:build:azure-dev
```

For prod, replace `azure-dev` with `azure-prod`.
For uat, replace `azure-dev` with `azure-uat`.

The compiled applications can be found there in ./dist/apps/ folder.

<!-- # Bundle Analysis

First, install globally the bundle analyzer:
```
npm install -g webpack-bundle-analyzer
```

You can then run, for both back, front office and web widgets projects:
```
ng build --stats-json
```
This will create an additional find stats.json in your ./dist folder of each project.


Finally, run:
```
webpack-bundle-analyzer ./dist/<project-name>/stats.json
```
and your browser will pop up the page at localhost:8888. -->

# Useful commands

## Development server

To serve a project, run:
```
npx nx run <project>:server:<config>
```
Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files.

For example:

```
npx nx run back-office:serve
```

will serve back-office with default development configuration.

```
npx nx run back-office:serve:oort-local
```

will serve back-office, connecting to the deployed back-end for development.

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

Run `npx prettier --write "**/*.{scss,html}"` to execute prettier and update all scss / html files locally.

## Analyze bundle

Start by building apps adding `--stats-json` flag. For example:

```
npx nx run back-office:build -- --stats-json
```

Then, run `webpack-bundle-analyzer` command to see the tree of your bundles:

```
npx webpack-bundle-analyzer dist/apps/back-office/stats.json
```

## Storybook

UI library has its own storybook definition. To execute storybook locally, you can run:

```
npx nx run ui:storybook
```

To build it, you can run:
```
npx nx run ui:build-storybook
```

Pushing the code on the repo should automatically deploy storybook on a public environment.

## Web components

To test web components, you can:
- go to this repo: https://github.com/ReliefApplications/app-builder-widgets-poc
- Switch to the branch: https://github.com/ReliefApplications/app-builder-widgets-poc/tree/fix/68747_add_forms_and_missing_styles_file
- execute: `npm i && npm run start`
You should find under the form widget dropdown some form types in order to test the form web component.

<!-- ## Build the web components

We first need to generate the elements, using this command:
```
npm run build:elem
```

Then, a bundle can be generated from the files using this command:
```
npm run bundle:elem
``` -->

<!-- ## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). -->

<!-- ## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md). -->

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
