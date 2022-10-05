OORT Front-end
=======
[![GitHub version](https://img.shields.io/github/v/release/ReliefApplications/oort-frontend)](https://img.shields.io/github/v/release/ReliefApplications/oort-frontend)
[![Github Pages](https://github.com/ReliefApplications/oort-frontend/actions/workflows/github-pages.yml/badge.svg)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/github-pages.yml)
[![Storybook](https://github.com/ReliefApplications/oort-frontend/actions/workflows/storybook.yml/badge.svg)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/storybook.yml)

# Versions

* 1.2 : [![Build](https://github.com/ReliefApplications/oort-frontend/actions/workflows/build.yml/badge.svg?branch=release-1.2.0)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/build.yml) [![CI](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml/badge.svg?branch=release-1.2.0)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml) [![CodeQL](https://github.com/ReliefApplications/oort-frontend/actions/workflows/codeql-analysis.yml/badge.svg?branch=release-1.2.0)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/codeql-analysis.yml)
* 1.3 : [![Build](https://github.com/ReliefApplications/oort-frontend/actions/workflows/build.yml/badge.svg?branch=release-1.3.0)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/build.yml) [![CI](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml/badge.svg?branch=release-1.3.0)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml) [![CodeQL](https://github.com/ReliefApplications/oort-frontend/actions/workflows/codeql-analysis.yml/badge.svg?branch=release-1.3.0)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/codeql-analysis.yml)
* 1.3-next : [![Build](https://github.com/ReliefApplications/oort-frontend/actions/workflows/build.yml/badge.svg?branch=release-1.3.0-next)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/build.yml) [![CI](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml/badge.svg?branch=release-1.3.0-next)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml) [![CodeQL](https://github.com/ReliefApplications/oort-frontend/actions/workflows/codeql-analysis.yml/badge.svg?branch=release-1.3.0-next)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/codeql-analysis.yml)
* 1.4 : [![Build](https://github.com/ReliefApplications/oort-frontend/actions/workflows/build.yml/badge.svg?branch=release-1.4.0)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/build.yml) [![CI](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml/badge.svg?branch=release-1.4.0)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/ci.yml) [![CodeQL](https://github.com/ReliefApplications/oort-frontend/actions/workflows/codeql-analysis.yml/badge.svg?branch=release-1.4.0)](https://github.com/ReliefApplications/oort-frontend/actions/workflows/codeql-analysis.yml)

# Introduction

This front-end was made using [Angular](https://angular.io/). It uses multiple external packages, but the relevant ones are:

*   [Material Angular](https://material.angular.io/), for the UI
*   [KendoUI Angular](https://www.telerik.com/kendo-angular-ui), for the widgets of the dashboards
*   [SurveyJS](https://surveyjs.io/), for the form builder
*   [Apollo Angular](https://www.apollographql.com/docs/angular/), as a GraphQL client, to interact with the back-end

It was made for a Proof of Concept of a UI Builder for WHO.

To read more about the project, and how to setup the back-end, please refer to the [documentation of the project](https://gitlab.com/who-ems/ui-doc).

*   [Setup](https://gitlab.com/who-ems/ui-doc#how-to-setup)
*   [Deployment](https://gitlab.com/who-ems/ui-doc#how-to-deploy)


# General

The project is seperated into four sub-projects:
- back-office, an application accessible to administrators
- front-office, an application that would depend on the logged user
- safe, a library shared by both other projects
- web-widgets, an application to genereate the web components

Every change made to the shared library will require a new build of the library, please refer to the commands section to see the command to execute.

# Azure configuration

If you want to deploy on Azure, start building the shared library:
```
ng build safe
```

Then, build the back-office with Azure environment file:
```
ng build --configuration azure
```

The compiled code can be found there in ./dist/back-office folder.

# Bundle Analysis

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
and your browser will pop up the page at localhost:8888.

# Useful commands

## Compodoc

The package.json contains commands to generate Angular documentation.

Commands have to be executed once per project, and executed again after any modification of the related code.

Subsequent command will generate the documentation:
```
npm run compodoc:<project>
```

If the command fails, check that compodoc is installed on your computer.
You can execute following command for that:
```
npm i -g compodoc
```

A subfolder should be generated under *documentation* folder.

You can drag and drop the index.html file of this subfolder directly in a browser to see the documentation of an angular project.

## Development server

To launch the dev server of a project, run:
```bash
ng serve <project-name>
```
Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files.

By default, if you omit the `<project-name>`, it will run the `back-office` project.

### Running both front-office and back-office
If you want to run the dev server of the back-office and front-office at the same time:
* in the `back-office` project:
    * in the `environment.ts` file, update the `frontOfficeUri` property to `http://localhost:4201/`
* in the `front-office` project:
    * in the `environment.ts` file, update the following properties:
        - `redirectUri`: `'http://localhost:4201/'`
        - `postLogoutRedirectUri`: `'http://localhost:4201/auth/'`
        - `frontOfficeUri`: `'http://localhost:4201/'`
    * in the `protractor.conf.js` file, update the `baseUrl` property to `http://localhost:4201/`
* in the `backend` local repository, add `http://localhost:4201` to the list of `ALLOWED_ORIGINS` in your `.env` file
* finally run:
    ```bash
    ng serve back-office
    ng serve front-office --port 4201
    ```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

It is needed to use the `--project` flag in order to build a specific project.

For example, in order to build the *safe* library, the command is:
```
ng build --project=safe
```

If you're working on the library, you can see the changes in direct time using this command:
```
ng build --watch --project=safe
```

## Deploy the package

Deployment of the npm @safe/builder package is a 3-steps process:

- check that the current package version isn't already deployed. Increase it if a version exists.

- Build the package:
```
ng build --prod safe
```

- Deploy the package ( subsequent command can be executed if you're at the root of the project. Otherwise, change the path ):
```
npm publish ./dist/safe
```

## Build the web components

We first need to generate the elements, using this command:
```
npm run build:elem
```

Then, a bundle can be generated from the files using this command:
```
npm run bundle:elem
```

## Deploy a release

[Standard Version library](https://github.com/conventional-changelog/standard-version) is used by the project.

In order to increase the versions of the code, you can use the related commands:

- For a minor version:

```
npm run release:minor
```

- For a patch:

```
npm run release:patch
```

- For a major version:

```
npm run release:major
```

The cli should indicate the next command to run, in order to deploy the version.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Common issues

## Javascript heap out of memory

Error can appear when executing the front-end due to a memory limit.

You can use this command to serve the front-end if the error occurs:
```
node --max_old_space_size=8048 ./node_modules/@angular/cli/bin/ng serve
```
