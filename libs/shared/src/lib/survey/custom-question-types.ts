import { Injector, NgZone } from '@angular/core';
import { DomService } from '../services/dom/dom.service';
import { ComponentCollection } from 'survey-core';
import * as ResourceComponent from './components/resource';
import * as ResourcesComponent from './components/resources';
import * as OwnerComponent from './components/owner';
import * as UsersComponent from './components/users';
import * as GeospatialComponent from './components/geospatial';
import { Apollo } from 'apollo-angular';

/**
 * Custom question types for the survey creator toolbox
 */
export enum CustomQuestionTypes {
  RESOURCE = 'resource',
  RESOURCES = 'resources',
  OWNER = 'owner',
  USERS = 'users',
  GEO_SPATIAL = 'geoSpatial',
}

/** Custom question options */
export type InitCustomQuestionOptions = {
  injector: Injector;
  instance: ComponentCollection;
  ngZone: NgZone;
  document: Document;
};

/**
 * Init the custom question component
 */
export const InitCustomQuestionComponent: {
  [key: string]: (options: InitCustomQuestionOptions) => void;
} = {
  resource: (options) => {
    const { injector, instance, ngZone, document } = options;
    ResourceComponent.init(injector, instance, ngZone, document);
  },
  resources: (options) => {
    const { injector, instance, ngZone, document } = options;
    ResourcesComponent.init(injector, instance, ngZone, document);
  },
  owner: (options) => {
    const { injector, instance } = options;
    const apollo = injector.get(Apollo);
    OwnerComponent.init(apollo, instance);
  },
  users: (options) => {
    const { injector, instance } = options;
    const domService = injector.get(DomService);
    UsersComponent.init(instance, domService);
  },
  geoSpatial: (options) => {
    const { injector, instance } = options;
    const domService = injector.get(DomService);
    GeospatialComponent.init(domService, instance);
  },
};
