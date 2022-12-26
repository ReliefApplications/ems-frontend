import { Role } from '../../../models/user.model';

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

/**
 * The value can be either a boolean or an array of strings.
 * If it's a boolean, it means that it's a global permission.
 * If it's an array of strings, it means that that it's a local permission,
 * and the array contains the ids of the applications in which the user has that permissions.
 */
export type Ability = {
  [key in Entity]: {
    canRead: boolean | string[];
    canManage: boolean | string[];
    canCreate?: boolean | string[];
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
   * Constructor initializes ability from user roles.
   *
   * @param roles - User roles.
   */
  constructor(roles: Role[]) {
    // Define ability for each entity
    roles.forEach((role) => {
      const { permissions, application } = role;
      if (!permissions) return;
      permissions.forEach((permission) => {
        // If permission is not properly defined, skip it
        const { type } = permission;
        if (!type) return;

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
          const op =
            action === 'see'
              ? 'canRead'
              : action === 'manage'
              ? 'canManage'
              : action === 'create'
              ? 'canCreate'
              : null;

          if (!op) return;

          // if is global permission, set to true
          if (!application?.id)
            Object.assign(this.ability[entity], { [op]: true });
          // if is local, and permission is not already set to true, set array of application ids
          else if (application?.id && !this.ability[entity][op]) {
            Object.assign(this.ability[entity], {
              [op]: [application.id],
            });
          }
          // if is local, and permission is already set to array, add application id to array
          else if (
            application?.id &&
            typeof this.ability[entity][op] !== 'boolean'
          ) {
            Object.assign(this.ability[entity], {
              [op]: [...(this.ability[entity][op] as string[]), application.id],
            });
          }
        } else {
          console.error('Entity not defined', entity);
        }
      });
    });
  }

  /**
   * Check if user has ability to perform action on entity.
   *
   * @param action - Action to perform.
   * @param entity - Entity to perform action on.
   * @param applicationId - Application id, to check local permissions.
   * @returns A boolean indicating if user has ability.
   */
  public can = (action: Action, entity: Entity, applicationId?: string) => {
    const op =
      action === 'read'
        ? 'canRead'
        : action === 'manage'
        ? 'canManage'
        : action === 'create'
        ? 'canCreate'
        : null;

    if (op === null) return false;

    return (
      (typeof this.ability[entity][op] === 'boolean' &&
        this.ability[entity][op]) ||
      (Array.isArray(this.ability[entity][op]) &&
        applicationId &&
        (this.ability[entity][op] as string[]).includes(applicationId))
    );
  };
}
