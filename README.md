UI Builder Front-end
=======

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

The project is seperated into three sub-projects:
- back-office, an application accessible to administrators
- front-office, an application that would depend on the logged user
- who-ems, a library shared by both other projects

Every change made to the shared library will require a new build of the library, please refer to the commands section to see the command to execute.


# Useful commands

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

It is needed to use the `--project` flag in order to serve a specific project.

For example, in order to serve the *back-office* application, the command is:
```
ng serve --project=who-ems
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

It is needed to use the `--project` flag in order to build a specific project.

For example, in order to build the *who-ems* library, the command is:
```
ng build --project=who-ems
```

If you're working on the library, you can see the changes in direct time using this command:
```
ng build --watch --project=who-ems
```

## Deploy the package

Deployment of the npm @who-ems/builder package is a 3-steps process:

- check that the current package version isn't already deployed. Increase it if a version exists.

- Build the package:
```
ng build --project=who-ems
```

- Deploy the package ( subsequent command can be executed if you're at the root of the project. Otherwise, change the path ):
```
npm publish ./projects/who-ems
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
