import { isNil } from 'lodash';
import { Permission } from '../../../models/user.model';

/** Entities user has ability defined for */
const ENTITIES = [
  // Global
  'api_configurations',
  'applications',
  'forms',
  'groups',
  'resources',
  'roles',
  'users',
  'distribution_lists',
  'templates',
] as const;

export type Entity = typeof ENTITIES[number];
export type Action = 'read' | 'manage' | 'create';

export type Ability = {
  [key in Entity]: {
    canRead: boolean;
    canManage: boolean;
    canCreate?: boolean;
  };
};

/** User ability class, exposes 'can' method */
export class UserAbility {
  private ability: Ability = ENTITIES.reduce((acc, entity) => {
    acc[entity] = {
      canRead: false,
      canManage: false,
    };
    return acc;
  }, {} as Ability);

  /**
   * Constructor initializes ability from permissions.
   *
   * @param permissions - User permissions.
   */
  constructor(permissions: Permission[]) {
    // Define ability for each entity
    permissions.forEach((permission) => {
      // If permission is not properly defined, skip it
      const { type, global } = permission;
      if (!type || isNil(global)) return;

      // Matches permission type, if no match, skip it
      const regex = /can_(create|manage|see)_(\w+)/;
      const match = type.match(regex);
      if (!match) return;

      const action = match[1];
      const entity = match[2] as Entity;
      // ex: ['see', 'forms']

      // Check if entity is defined
      if (!ENTITIES.includes(entity as Entity)) return;

      if (entity in this.ability) {
        if (action === 'see') {
          Object.assign(this.ability[entity], { canRead: true });
        }
        if (action === 'manage') {
          Object.assign(this.ability[entity], { canManage: true });
        }
        if (action === 'create') {
          Object.assign(this.ability[entity], { canCreate: true });
        }
      } else {
        console.error('Entity not defined', entity);
      }
    });
  }

  public can = (action: Action, entity: Entity) => {
    switch (action) {
      case 'read':
        return this.ability[entity].canRead;
      case 'manage':
        return this.ability[entity].canManage;
      case 'create':
        // If entity does not have 'canCreate' property, return false
        return !!this.ability[entity].canCreate;
      default:
        return false;
    }
  };
}
