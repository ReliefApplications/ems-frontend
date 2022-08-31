import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, isArray, isEqual } from 'lodash';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Resource } from '../../../../models/resource.model';
import {
  Access,
  ResourceRolePermissions,
  Permission,
} from '../permissions.types';
import { createFilterGroup } from '../../../query-builder/query-builder-forms';
import { FormGroup } from '@angular/forms';
import { QueryBuilderService } from '../../../../services/query-builder.service';
import { AggregationBuilderService } from '../../../../services/aggregation-builder.service';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { MatTableDataSource } from '@angular/material/table';

/** Default permissions for a access filter */
const BASE_PERMISSIONS = {
  canSeeRecords: false,
  canCreateRecords: false,
  canUpdateRecords: false,
  canDeleteRecords: false,
};

type AccessPermissions = {
  access: Access;
  permissions: {
    [key in Permission]: boolean;
  };
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
  };
  public permissionTypes = Object.values(Permission);
  public isEqual = isEqual;

  public resource: Resource;
  public fields: any;
  private role: string;
  private metaQuery$: Observable<ApolloQueryResult<any>> | null;
  public metaFields: any;

  public displayedColumns: string[] = ['filter', 'actions'];
  public accesses = new MatTableDataSource<AccessPermissions>([]);
  private initialAccesses: AccessPermissions[];
  public editingAccess?: AccessPermissions;
  public editingAccessResource?: FormGroup;

  /**
   * Modal for the definition of access/permissions for a given resource
   *
   * @param data Object containing the name and initial permissions for a resource and role
   * @param data.resource The selected resource
   * @param data.permissions The permissions for the selected resource
   * @param data.role The role id
   * @param translate Angular translate service
   * @param queryBuilder Shared query builder service
   * @param aggregationBuilder Shared aggregation builder service
   * @param dialogRef Dialog ref
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      resource: Resource;
      permissions?: ResourceRolePermissions;
      role?: string;
    },
    public translate: TranslateService,
    private queryBuilder: QueryBuilderService,
    private aggregationBuilder: AggregationBuilderService,
    private dialogRef: MatDialogRef<SafeRoleResourceFiltersComponent>
  ) {
    if (data.permissions) {
      const cpyPerm = cloneDeep(data.permissions);

      // filters out permissions without access object defined
      Object.values(Permission).forEach((permission) => {
        cpyPerm[permission] = cpyPerm[permission].filter((x) => x.access);
        cpyPerm[permission].forEach((entry) => {
          if (!entry.access) return;
          const accessIndex = this.accesses.data.findIndex((x) =>
            isEqual(x.access, entry.access)
          );
          if (accessIndex >= 0)
            this.accesses.data[accessIndex].permissions[permission] = true;
          else
            this.accesses.data.push({
              access: entry.access,
              permissions: {
                ...BASE_PERMISSIONS,
                [permission]: true,
              },
            });
        });
      });
    }
    this.initialAccesses = cloneDeep(this.accesses.data);
    this.resource = data.resource;
    this.role = data.role || '';
    console.log(this.resource.queryName);
    this.fields = this.queryBuilder.getFields(this.resource.queryName || '');

    this.metaQuery$ = this.queryBuilder.buildMetaQuery({
      fields: this.aggregationBuilder.formatFields(this.fields || []),
      name: this.resource.queryName,
    });
    if (this.metaQuery$) {
      this.metaQuery$.subscribe((res) => {
        this.metaFields = res.data[`_${this.resource.queryName}Meta`];
      });
    }
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
   * Gets the correspondent icon for a given permission
   *
   * @param permission The permission name
   * @param access the accesses
   * @returns the name of the icon to be displayed
   */
  getIcon(permission: Permission, access: AccessPermissions) {
    switch (permission) {
      case Permission.SEE:
        return access?.permissions[permission]
          ? 'visibility'
          : 'visibility_off';
      case Permission.CREATE:
        return 'add';
      case Permission.UPDATE:
        return access?.permissions[permission] ? 'edit' : 'edit_off';
      case Permission.DELETE:
        return 'delete';
    }
  }

  /**
   * Gets the correspondent tooltip for a given permission
   *
   * @param permission The permission name
   * @param access the accesses
   * @returns the name of the icon to be displayed
   */
  getTooltip(permission: Permission, access: AccessPermissions) {
    switch (permission) {
      case Permission.SEE:
        return access.permissions[permission]
          ? 'components.role.tooltip.disallowFilterAccessibility'
          : 'components.role.tooltip.allowFilterAccessibility';
      case Permission.UPDATE:
        return access.permissions[permission]
          ? 'components.role.tooltip.disallowFilterUpdate'
          : 'components.role.tooltip.allowFilterUpdate';
      default:
        return access.permissions[permission]
          ? 'components.role.tooltip.disallowFilterDeletion'
          : 'components.role.tooltip.allowFilterDeletion';
    }
  }

  /**
   * Toggles the edition for a selected access row
   *
   * @param access The selected access
   */
  toggleEdition(access: AccessPermissions) {
    const accessIndex = this.accesses.data.findIndex((x) =>
      isEqual(x.access, access.access)
    );
    if (accessIndex < 0) return;
    this.editingAccessResource = createFilterGroup(access.access);
    this.editingAccessResource.valueChanges.subscribe(
      (res) => (this.accesses.data[accessIndex].access = res)
    );
    this.editingAccess = isEqual(this.editingAccess, access)
      ? undefined
      : access;
  }

  /**
   * Gets the prettified version of the value for a given question
   *
   * @param field The name of the field
   * @param value The value
   * @returns the prettified value
   */
  getPrettyValue(field: string, value: any) {
    if (!this.metaFields) return value;
    const fieldMeta = this.metaFields[field];
    if (!fieldMeta) return value;

    switch (fieldMeta.type) {
      case 'dropdown':
      case 'radiogroup':
        const choice = fieldMeta.choices.find((x: any) => x.value === value);
        return choice ? choice.text : value;
      case 'tagbox':
      case 'checkbox':
        if (!isArray(value)) return value;
        return value.map((op: any) => {
          const choices = fieldMeta.choices.find((x: any) => x.value === op);
          return choices ? choices.text : op;
        });
      case 'boolean':
        if (typeof value !== 'boolean') return value;
        return value
          ? this.translate.instant('common.true')
          : this.translate.instant('common.false');
      default:
        return value;
    }
  }

  /** Adds new access filter to access list and toggles the edition for it */
  handleNewFilter() {
    const newFilter = {
      access: { logic: 'and', filters: [] },
      permissions: {
        canCreateRecords: false,
        canDeleteRecords: false,
        canSeeRecords: false,
        canUpdateRecords: false,
      },
    };

    this.accesses.data = [...this.accesses.data, newFilter];

    this.toggleEdition(newFilter);
  }

  /**
   * Removes a filter from the accesses array
   *
   * @param access The access filter to be removed
   */
  handleRemoveFilter(access: AccessPermissions) {
    const removedIndex = this.accesses.data.findIndex((x) =>
      isEqual(x.access, access.access)
    );
    this.editingAccess = undefined;
    this.accesses.data.splice(removedIndex, 1);

    // required to update the table
    this.accesses.data = this.accesses.data;
  }

  /**
   * Calculates the difference between the initial access array
   * and the current one, closes the dialog ang returns the array of updates needed
   * to go from the initial value to the current one
   */
  getDifference() {
    const initial = this.initialAccesses;
    const current = cloneDeep(this.accesses.data);

    const ops: {
      [key in Permission]?: {
        add?: { role: string; access: Access }[];
        remove?: { role: string; access: Access }[];
      };
    } = {};

    // Loops thorugh the initial array. If element is not in the current array,
    // the permissions for that access should be removed, if it is in the current array
    // and permissions are different, they should be upated.
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
              const opPerm = ops[permission];
              if (!opPerm)
                Object.assign(ops, {
                  [permission]: {
                    [action]: [{ role: this.role, access: access.access }],
                  },
                });
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
            const opPerm = ops[permission];
            if (!opPerm)
              Object.assign(ops, {
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

    // Loops thorugh the remaining elements of the current array
    // each one lasting (not spliced in the previous loop) should be pushed
    current.forEach((curr) => {
      this.permissionTypes.forEach((permission) => {
        if (curr.permissions[permission]) {
          const opPerm = ops[permission];
          if (!opPerm)
            Object.assign(ops, {
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
    this.dialogRef.close({ id: this.resource.id, permissions: ops });
  }

  ngOnInit(): void {}
}
