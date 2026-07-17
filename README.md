# OORT Front-end

[![Github Pages](https://github.com/ReliefApplications/ems-frontend/actions/workflows/github-pages.yml/badge.svg)](https://github.com/ReliefApplications/ems-frontend/actions/workflows/github-pages.yml)
[![Storybook](https://github.com/ReliefApplications/ems-frontend/actions/workflows/storybook.yml/badge.svg)](https://github.com/ReliefApplications/ems-frontend/actions/workflows/storybook.yml)

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

To read more about the project, and how to setup the back-end, please refer to the [documentation of the project](https://gitlab.com/who-ems/ui-doc).

- [Setup](https://gitlab.com/who-ems/ui-doc#how-to-setup)
- [Deployment](https://gitlab.com/who-ems/ui-doc#how-to-deploy)

In top of Angular, [Nx](https://nx.dev/) was installed, to better split projects and libs.

# General

The project is separated into four sub-projects:

- back-office, an application accessible to administrators
- front-office, an application that would depend on the logged user
- web-widgets, an application to generate the web components
- public-forms, an application to share single forms publicly, without authentication

One library exists:

- shared, a library for common ui / capacity, shared with other projects

Library changes should automatically be detected when serving the other projects.

# Public forms

The public-forms application renders a single form so it can be shared with people that do not have an account: anyone with the link can open the form and submit records, without logging in.

## How it works

- The app exposes a single route, `/<form-id>`, where `<form-id>` is the id of a form (as seen in the back-office url when editing the form).
- The form is fetched from the back-end public REST endpoint (`GET <api-url>/public/forms/<form-id>`), which only exposes forms marked as public, and rendered with the same SurveyJS renderer as the other applications (`shared-form` component).
- No authentication is required: the app replaces the shared `AuthService` with a `PublicAuthService` that acts as an anonymous "Public user".
- If the id is missing, malformed, or does not match a public form, the user is redirected to the root page, which displays a "form not found" message.

## Usage

Serve the app locally (connecting to a local back-end):

```
npx nx run public-forms:serve
```

Then navigate to:

```
http://localhost:4200/<form-id>
```

Other serve configurations are available to connect to deployed back-ends: `local-dev`, `local-uat`, `local-prod`. For example:

```
npx nx run public-forms:serve:local-dev
```

## Build

Build for Azure environments as for the other apps:

```
npx nx run public-forms:build:azure-dev
```

For prod, replace `azure-dev` with `azure-prod`. For uat, replace `azure-dev` with `azure-uat`.
The compiled application can be found in the ./dist/apps/public-forms folder.

## Sharing a form

To share a form publicly:

1. In the back-office, open the form in the form builder and enable the "Public form" toggle, in the general settings of the form. On save, the back-end extracts this flag from the form definition and exposes the form on the public endpoints.
2. Copy the form id from the url, and share the link `<public-forms-url>/<form-id>`.

# Azure configuration

If you want to deploy on Azure, build back-office and front-office:

```
npx nx run back-office:build:azure-dev
npx nx run front-office:build:azure-dev
```

For prod, replace `azure-dev` with `azure-prod`.
For uat, replace `azure-dev` with `azure-uat`.

The compiled applications can be found there in ./dist/apps/ folder.

# Deployment

These steps describe how to do a deployment from your machine to target static web app.

Get a deployment token:

```
az staticwebapp secrets list --name <static-webapp-name> --query "properties.apiKey"
```

Deploy code:

```
npm i -g @azure/static-web-apps-cli
npx swa deploy ./dist/apps/<app-name> --deployment-token <insert-deployment-token> --env production
```

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

Start by building apps adding `--statsJson` flag. For example:

```
npx nx run back-office:build --statsJson
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
