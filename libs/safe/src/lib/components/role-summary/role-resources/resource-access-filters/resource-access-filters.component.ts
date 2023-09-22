import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { get, isEqual, set } from 'lodash';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Resource } from '../../../../models/resource.model';
import { Access, Permission } from '../permissions.types';
import { createFilterGroup } from '../../../query-builder/query-builder-forms';
import {
  FormBuilder,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { SafeRestService } from '../../../../services/rest/rest.service';
import { firstValueFrom } from 'rxjs';

type AccessPermissions = {
  access: Access;
  permissions: {
    [key in Permission]: boolean;
  };
};

/** Permissions to apply by default to all access filters */
const BASE_PERMISSIONS = {
  canCreateRecords: false,
  canSeeRecords: false,
  canUpdateRecords: false,
  canDeleteRecords: false,
};

/** Modal for the definition of access/permissions for a given resource */
@Component({
  selector: 'safe-resource-access-filters',
  templateUrl: './resource-access-filters.component.html',
  styleUrls: ['./resource-access-filters.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SafeRoleResourceFiltersComponent implements OnInit {
  private opMap: {
    [key: string]: string;
  } = {
    eq: this.translate.instant('kendo.grid.filterEqOperator'),
    neq: this.translate.instant('kendo.grid.filterNotEqOperator'),
    contains: this.translate.instant('kendo.grid.filterContainsOperator'),
    doesnotcontain: this.translate.instant(
      'kendo.grid.filterNotContainsOperator'
    ),
    startswith: this.translate.instant('kendo.grid.filterStartsWithOperator'),
    endswith: this.translate.instant('kendo.grid.filterEndsWithOperator'),
    isnull: this.translate.instant('kendo.grid.filterIsNullOperator'),
    isnotnull: this.translate.instant('kendo.grid.filterIsNotNullOperator'),
    isempty: this.translate.instant('kendo.grid.filterIsEmptyOperator'),
    isnotempty: this.translate.instant('kendo.grid.filterIsNotEmptyOperator'),
    in: this.translate.instant('kendo.grid.filterIsInOperator'),
    notin: this.translate.instant('kendo.grid.filterIsNotInOperator'),
    gt: this.translate.instant('kendo.grid.filterGtOperator'),
    gte: this.translate.instant('kendo.grid.filterGteOperator'),
    lt: this.translate.instant('kendo.grid.filterLtOperator'),
    lte: this.translate.instant('kendo.grid.filterLteOperator'),
  };
  public permissionTypes = Object.values(Permission);

  @Input() disabled = false;
  @Input() role!: string; // Opened role

  // === RESOURCE ===
  @Input() resource!: Resource; // Opened resource
  public filterFields: any[] = [];

  // === EDITION ===
  private initialValue!: AccessPermissions[];
  public openedFilterIndex: number | null = null;
  public filtersFormArray!: UntypedFormArray;
  public openedFilterFormGroup?: UntypedFormGroup;
  @Output() update = new EventEmitter();

  // === TABLE ELEMENTS ===
  public displayedColumns: string[] = ['filter', 'actions'];
  public filters = new Array<AccessPermissions>();

  /**
   * Modal for the definition of access/permissions for a given resource
   *
   * @param translate Angular translate service
   * @param fb Angular form builder
   * @param restService Safe REST service
   */
  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private restService: SafeRestService
  ) {}

  async ngOnInit(): Promise<void> {
    const filters: AccessPermissions[] = [];
    Object.keys(get(this.resource, 'rolePermissions', {})).forEach(
      (permission) => {
        const access = get(
          this.resource,
          `rolePermissions.${permission}.access`,
          {}
        );
        for (const filter of get(access, 'filters', [])) {
          const existingFilter = filters.find((x) => isEqual(x.access, filter));
          if (existingFilter) {
            set(existingFilter, `permissions.${permission}`, true);
          } else {
            filters.push({
              access: filter,
              permissions: {
                ...BASE_PERMISSIONS,
                [permission]: true,
              },
            });
          }
        }
      }
    );

    this.filters = this.setTableElements(filters);
    this.filtersFormArray = this.fb.array(
      filters.map((x) => this.createAccessFilterFormGroup(x))
    );
    this.initialValue = this.filtersFormArray.value;
    this.filterFields = get(this.resource, 'metadata', [])
      .filter((x: any) => x.filterable !== false)
      .map((x: any) => ({ ...x }));

    const userAttributes: { value: string; text: string }[] =
      await firstValueFrom(this.restService.get('/permissions/attributes'));

    const options = this.filterFields.map((x) => ({
      value: x.name,
      text: x.name,
    }));

    const attrFields = userAttributes.map((x) => ({
      text: x.text,
      name: x.value,
      editor: 'attribute',
      options,
    }));

    this.filterFields.unshift({
      text: this.translate.instant('common.attribute.few'),
      // regular questions can't have dollar signs in their name
      name: `$attribute`,
      filter: {
        operators: ['eq', 'in', 'neq', 'notin'],
      },
      fields: attrFields,
      editor: null,
    });
  }

  /**
   * Create access filter group from value
   *
   * @param filter initial value
   * @returns filter as form group
   */
  private createAccessFilterFormGroup(filter?: AccessPermissions) {
    return this.fb.group({
      access: createFilterGroup(get(filter, 'access', null)),
      permissions: this.fb.group({
        canCreateRecords: get(filter, 'permissions.canCreateRecords', false),
        canDeleteRecords: get(filter, 'permissions.canDeleteRecords', false),
        canSeeRecords: get(filter, 'permissions.canSeeRecords', false),
        canUpdateRecords: get(filter, 'permissions.canUpdateRecords', false),
      }),
    });
  }

  /**
   * Update permission of filter at index
   *
   * @param index index of filter access to update
   * @param action permission to update
   */
  public toggleFilterAccess(index: number, action: string) {
    const formGroup = this.filtersFormArray.at(index);
    const formControl = formGroup.get(`permissions.${action}`);
    formControl?.setValue(!formControl.value);
    this.filters = this.setTableElements(this.filtersFormArray.value);
  }

  /**
   * Gets the string representation of an access object
   *
   * @param access The access object
   * @returns the string representation of an access object
   */
  getAccessString(access: Access) {
    const rulesStr: string[] = [];
    access.filters.forEach((rule) => {
      // nested access
      // eslint-disable-next-line no-prototype-builtins
      if (rule.hasOwnProperty('logic')) {
        const nestedAccess = rule as Access;
        rulesStr.push(`(${this.getAccessString(nestedAccess)})`);
      } else {
        const r = rule as {
          field: string;
          operator: string;
          value: string;
        };
        rulesStr.push(
          `${r.field} ${this.opMap[
            r.operator
          ].toLowerCase()} ${this.getPrettyValue(r.field, r.value)}`.trim()
        );
      }
    });
    if (rulesStr.length)
      return rulesStr.join(
        ` ${(access.logic === 'and'
          ? this.translate.instant('kendo.grid.filterAndLogic')
          : this.translate.instant('kendo.grid.filterOrLogic')
        ).toLowerCase()} `
      );
    else return this.translate.instant('components.role.summary.newFilter');
  }

  /**
   * Serialize single table element from filter
   *
   * @param filter filter to serialize
   * @returns serialized element
   */
  private setTableElement(filter: AccessPermissions): any {
    return {
      access: filter.access,
      permissions: [
        Permission.SEE,
        Permission.CREATE,
        Permission.UPDATE,
        Permission.DELETE,
      ].map((x) => ({
        name: x,
        icon: this.getIcon(filter, x),
        variant: this.getVariant(filter, x),
        tooltip: this.getTooltip(filter, x),
      })),
    };
  }

  /**
   * Serialize list of table elements from filter
   *
   * @param filters filters to serialize
   * @returns serialized elements
   */
  private setTableElements(filters: AccessPermissions[]): any[] {
    return filters.map((x: AccessPermissions) => this.setTableElement(x));
  }

  /**
   * Gets the correspondent icon for a given permission
   *
   * @param access the accesses
   * @param permission The permission name
   * @returns the name of the icon to be displayed
   */
  private getIcon(access: AccessPermissions, permission: Permission) {
    const hasPermission = get(access, `permissions.${permission}`, false);
    switch (permission) {
      case Permission.SEE:
        return hasPermission ? 'visibility' : 'visibility_off';
      case Permission.CREATE:
        return 'add';
      case Permission.UPDATE:
        return hasPermission ? 'edit' : 'edit_off';
      case Permission.DELETE:
        return 'delete';
    }
  }

  /**
   * Gets the correspondent variant for a given permission
   *
   * @param access the accesses
   * @param permission The permission name
   * @returns the name of the icon to be displayed
   */
  private getVariant(access: AccessPermissions, permission: Permission) {
    const hasPermission = get(access, `permissions.${permission}`, false);
    return hasPermission ? 'primary' : 'grey';
  }

  /**
   * Gets the correspondent tooltip for a given permission
   *
   * @param access the accesses
   * @param permission The permission name
   * @returns the name of the icon to be displayed
   */
  private getTooltip(access: AccessPermissions, permission: Permission) {
    const hasPermission = get(access, `permissions.${permission}`, false);
    switch (permission) {
      case Permission.SEE:
        return hasPermission
          ? 'components.role.tooltip.grantFilterReadRecordsPermission'
          : 'components.role.tooltip.notGrantFilterReadRecordsPermission';
      case Permission.UPDATE:
        return hasPermission
          ? 'components.role.tooltip.grantFilterUpdateRecordsPermission'
          : 'components.role.tooltip.notGrantFilterUpdateRecordsPermission';
      default:
        return hasPermission
          ? 'components.role.tooltip.grantFilterDeleteRecordsPermission'
          : 'components.role.tooltip.notGrantFilterDeleteRecordsPermission';
    }
  }

  /**
   * Toggles the edition for a selected access row
   *
   * @param index index of filter to edit
   */
  toggleFilterEdition(index: number) {
    if (index < 0) return;
    if (index !== this.openedFilterIndex) {
      this.filters = this.setTableElements(this.filtersFormArray.value);
      const filterFormGroup = this.filtersFormArray.at(index).get('access');
      if (filterFormGroup) {
        this.openedFilterFormGroup = filterFormGroup as UntypedFormGroup;
        this.openedFilterIndex = index;
      }
    } else {
      this.openedFilterIndex = null;
      this.filters = this.setTableElements(this.filtersFormArray.value);
    }
  }

  /**
   * Gets the prettified version of the value for a given question
   *
   * @param field The name of the field
   * @param value The value
   * @returns the prettified value
   */
  getPrettyValue(field: string, value: any) {
    return value;
    // const fieldMeta = this.metaFields[field];
    // if (!fieldMeta) return value;

    // switch (fieldMeta.type) {
    //   case 'dropdown':
    //   case 'radiogroup':
    //     const choice = fieldMeta.choices.find((x: any) => x.value === value);
    //     return choice ? choice.text : value;
    //   case 'tagbox':
    //   case 'checkbox':
    //     if (!isArray(value)) return value;
    //     return value.map((op: any) => {
    //       const choices = fieldMeta.choices.find((x: any) => x.value === op);
    //       return choices ? choices.text : op;
    //     });
    //   case 'boolean':
    //     if (typeof value !== 'boolean') return value;
    //     return value
    //       ? this.translate.instant('common.true')
    //       : this.translate.instant('common.false');
    //   default:
    //     return value;
    // }
  }

  /** Adds new access filter to access list and toggles the edition for it */
  addFilter() {
    const accessFilterGroup = this.createAccessFilterFormGroup();
    this.filtersFormArray.push(accessFilterGroup);
    this.filters = this.setTableElements(this.filtersFormArray.value);
    this.toggleFilterEdition(this.filters.length - 1);
  }

  /**
   * Delete a filter from the accesses array
   *
   * @param index index of filter to remove
   */
  deleteFilter(index: number) {
    this.openedFilterIndex = null;
    this.openedFilterFormGroup = undefined;
    this.filtersFormArray.removeAt(index);
    this.filters = this.setTableElements(this.filtersFormArray.value);
    if (this.filters.length === 0) {
      this.save();
    }
  }

  /**
   * Calculates the difference between the initial access array
   * and the current one, closes the dialog ang returns the array of updates needed
   * to go from the initial value to the current one
   */
  save() {
    const initial = this.initialValue;
    const current = this.filtersFormArray.value as AccessPermissions[];

    const update: {
      [key in Permission]?: {
        add?: { role: string; access: Access }[];
        remove?: { role: string; access: Access }[];
      };
    } = {};

    // Loops through the initial array. If element is not in the current array,
    // the permissions for that access should be removed, if it is in the current array
    // and permissions are different, they should be updated.
    initial.forEach((init) => {
      const currIndex = current.findIndex((x) =>
        isEqual(x.access, init.access)
      );
      if (currIndex >= 0) {
        // Filter still exists, checking for permission differences
        const [access] = current.splice(currIndex, 1);
        if (!isEqual(init.permissions, access.permissions)) {
          this.permissionTypes.forEach((permission) => {
            if (
              init.permissions[permission] !== access.permissions[permission]
            ) {
              // if its different and the current one is True, should add / else => remove
              const action = access.permissions[permission] ? 'add' : 'remove';
              const opPerm = update[permission];
              if (!opPerm)
                Object.assign(update, {
                  [permission]: {
                    [action]: [{ role: this.role, access: access.access }],
                  },
                });
              // eslint-disable-next-line no-prototype-builtins
              else if (opPerm && !opPerm?.hasOwnProperty(action)) {
                opPerm[action] = [{ role: this.role, access: access.access }];
              } else {
                opPerm[action]?.push({
                  role: this.role,
                  access: access.access,
                });
              }
            }
          });
        }
      } else {
        // Filter no longer exists, remove if previously had access
        this.permissionTypes.forEach((permission) => {
          if (init.permissions[permission]) {
            const opPerm = update[permission];
            if (!opPerm)
              Object.assign(update, {
                [permission]: {
                  remove: [{ role: this.role, access: init.access }],
                },
              });
            else if (opPerm && !opPerm.remove) {
              opPerm.remove = [{ role: this.role, access: init.access }];
            } else {
              opPerm.remove?.push({
                role: this.role,
                access: init.access,
              });
            }
          }
        });
      }
    });

    // Loops through the remaining elements of the current array
    // each one lasting (not spliced in the previous loop) should be pushed
    current.forEach((curr) => {
      this.permissionTypes.forEach((permission) => {
        if (curr.permissions[permission]) {
          const opPerm = update[permission];
          if (!opPerm)
            Object.assign(update, {
              [permission]: {
                add: [{ role: this.role, access: curr.access }],
              },
            });
          else if (opPerm && !opPerm.add) {
            opPerm.add = [{ role: this.role, access: curr.access }];
          } else {
            opPerm.add?.push({
              role: this.role,
              access: curr.access,
            });
          }
        }
      });
    });

    this.update.emit(update);
  }
}
