import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { get, isEqual } from 'lodash';
import { SafeSnackBarService } from '../../../../services/snackbar.service';
import { QueryBuilderService } from '../../../../services/query-builder.service';
import { Form } from '../../../../models/form.model';
import { Role } from '../../../../models/user.model';
import { Resource } from '../../../../models/resource.model';

import {
  GetResourceFormsQueryResponse,
  GET_RESOURCE_FORMS,
} from '../../graphql/queries';

import {
  EditFormAccessMutationResponse,
  EDIT_FORM_ACCESS,
} from '../../graphql/mutations';
import { MatDialog } from '@angular/material/dialog';
import { SafeRoleFormFiltersComponent } from './role-form-filters/role-form-filters.component';

export type FormRolePermissions = {
  [key in Permission]: {
    role: string;
    access?: Access;
  }[];
};

/** Permission type for Form */
export enum Permission {
  SEE = 'canSeeRecords',
  CREATE = 'canCreateRecords',
  UPDATE = 'canUpdateRecords',
  DELETE = 'canDeleteRecords',
}

/** Role access interface */
export interface Access {
  logic: string;
  filters: (
    | {
        field: string;
        operator: string;
        value: string;
      }
    | Access
  )[];
}

/**
 *  Component for the table of Forms of a resource
 *  including the possibility of setting permissions based on filters
 */
@Component({
  selector: 'safe-role-forms',
  templateUrl: './role-forms.component.html',
  styleUrls: ['./role-forms.component.scss'],
})
export class RoleFormsComponent implements OnInit {
  @Input() resource!: Resource;
  @Input() role!: Role;

  public loading = true;
  public updating = true;
  public displayedColumns: string[] = ['name', 'actions'];

  public forms: Form[] = [];
  public formsPermissions: {
    form?: string;
    permissions: FormRolePermissions;
  }[] = [];
  public permissionTypes = Object.values(Permission);

  /**
   * Resource tab of Role Summary component.
   *
   * @param apollo Apollo client service
   * @param dialog Material dialog service
   * @param snackBar shared snackbar service
   * @param queryBuilder shared querybuilder service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private queryBuilder: QueryBuilderService
  ) {}

  ngOnInit(): void {
    this.apollo
      .query<GetResourceFormsQueryResponse>({
        query: GET_RESOURCE_FORMS,
        variables: {
          resource: this.resource.id,
        },
      })
      .subscribe(
        (res) => {
          if (res.data) {
            this.forms = get(res.data.resource, 'forms', []).filter(
              (x) => x.id
            );
            this.formsPermissions = this.forms.map((form) => {
              const permissions: FormRolePermissions = {
                canSeeRecords: [],
                canCreateRecords: [],
                canUpdateRecords: [],
                canDeleteRecords: [],
              };
              for (const permission of this.permissionTypes) {
                permissions[permission] = get(
                  form,
                  `permissions.${permission}`,
                  []
                )
                  .filter((x: any) => {
                    switch (permission) {
                      case Permission.CREATE:
                        return x.id === this.role.id;
                      default:
                        return x.role === this.role.id;
                    }
                  })
                  .map((x: any) => {
                    const roleId =
                      permission === Permission.CREATE ? x.id : x.role;
                    return { role: roleId, access: x.access };
                  });
              }
              return {
                form: form.id,
                permissions,
              };
            });
          }
          this.loading = res.loading;
          this.updating = res.loading;
        },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        }
      );
  }

  /**
   * Edits the specified form permissions array
   *
   * @param form the form object to be updated
   * @param action the permission to be edited
   * @param access the accesses, if any
   */
  onEditFormAccess(form: Form, action: Permission, access?: Access): void {
    if (!this.role.id) return;
    this.updating = true;
    const updatedPermissions: {
      add?: string[] | { role: string }[];
      remove?: string[] | { role: string }[];
    } = {};
    let hasCurrPermission: boolean;
    switch (action) {
      case Permission.CREATE:
        hasCurrPermission = get(form, `permissions.${action}`, []).some(
          (x: any) => x.id === this.role.id
        );
        Object.assign(updatedPermissions, {
          [hasCurrPermission ? 'remove' : 'add']: [this.role.id],
        });
        break;
      default:
        hasCurrPermission = get(form, `permissions.${action}`, []).some(
          (x: any) => x.role === this.role.id && isEqual(x.access, access)
        );
        Object.assign(updatedPermissions, {
          [hasCurrPermission ? 'remove' : 'add']: [{ role: this.role.id }],
        });
        break;
    }
    this.apollo
      .mutate<EditFormAccessMutationResponse>({
        mutation: EDIT_FORM_ACCESS,
        variables: {
          id: form.id,
          permissions: {
            [action]: updatedPermissions,
          },
        },
      })
      .subscribe(
        (res) => {
          if (res.data) {
            const index = this.forms.findIndex(
              (x) => x.id === res.data?.editForm.id
            );
            const forms = [...this.forms];
            forms[index] = res.data.editForm;
            this.forms = forms;
            this.formsPermissions = this.forms.map((f) => {
              const permissions: FormRolePermissions = {
                canSeeRecords: [],
                canCreateRecords: [],
                canUpdateRecords: [],
                canDeleteRecords: [],
              };
              for (const permission of this.permissionTypes) {
                permissions[permission] = get(
                  f,
                  `permissions.${permission}`,
                  []
                )
                  .filter((x: any) => {
                    switch (permission) {
                      case Permission.CREATE:
                        return x.id === this.role.id;
                      default:
                        return x.role === this.role.id;
                    }
                  })
                  .map((x: any) => {
                    const roleId =
                      permission === Permission.CREATE ? x.id : x.role;
                    return { role: roleId, access: x.access };
                  });
              }
              return {
                form: f.id,
                permissions,
              };
            });
          }
          this.updating = false;
        },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.updating = false;
        }
      );
  }

  /**
   * Gets the correspondent icon for a given permission
   *
   * @param permission The permission name
   * @param form A form
   * @param access the accesses, if any
   * @returns the name of the icon to be displayed
   */
  getIcon(permission: Permission, form: Form, access?: Access) {
    const formsPermissions = this.formsPermissions.find(
      (x) => x.form === form.id
    );

    const hasPermission = formsPermissions
      ? formsPermissions.permissions[permission].some(
          (x) => x.role === this.role.id && isEqual(access, x.access)
        )
      : false;

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
   * Gets the correspondent tooltip for a given permission
   *
   * @param permission The permission name
   * @param form A form
   * @param access the accesses, if any
   * @returns the name of the icon to be displayed
   */
  getTooltip(permission: Permission, form: Form, access?: Access) {
    const formsPermissions = this.formsPermissions.find(
      (x) => x.form === form.id
    );

    const hasPermission = formsPermissions
      ? formsPermissions.permissions[permission].some(
          (x) => x.role === this.role.id && isEqual(access, x.access)
        )
      : false;

    switch (permission) {
      case Permission.SEE:
        return hasPermission
          ? 'components.role.tooltip.disallowRecordAccessibility'
          : 'components.role.tooltip.allowRecordAccessibility';
      case Permission.CREATE:
        return hasPermission
          ? 'components.role.tooltip.disallowRecordCreation'
          : 'components.role.tooltip.allowRecordCreation';
      case Permission.UPDATE:
        return hasPermission
          ? 'components.role.tooltip.disallowRecordUpdate'
          : 'components.role.tooltip.allowRecordUpdate';
      case Permission.DELETE:
        return hasPermission
          ? 'components.role.tooltip.disallowRecordDeletion'
          : 'components.role.tooltip.allowRecordDeletion';
    }
  }

  /**
   * Gets the correspondent variant for a given permission
   *
   * @param permission The permission name
   * @param form A form
   * @param access the accesses, if any
   * @returns the name of the icon to be displayed
   */
  getVariant(permission: Permission, form: Form, access?: Access) {
    const formsPermissions = this.formsPermissions.find(
      (x) => x.form === form.id
    );
    const hasPermission = formsPermissions
      ? formsPermissions.permissions[permission].some(
          (x) => x.role === this.role.id && isEqual(access, x.access)
        )
      : false;

    return hasPermission ? 'primary' : 'grey';
  }

  /**
   * Opens a modal where the user can set access filters for a given form
   *
   * @param form The selected form
   */
  openFormFilters(form: Form): void {
    const initPerm = this.formsPermissions.find((x) => x.form === form.id);
    const dialogRef = this.dialog.open(SafeRoleFormFiltersComponent, {
      data: {
        form,
        permissions: initPerm?.permissions,
        role: this.role.id,
      },
      panelClass: 'from-access-dialog',
    });
    dialogRef.afterClosed().subscribe((changes) => {
      if (!changes) return;
      this.apollo
        .mutate<EditFormAccessMutationResponse>({
          mutation: EDIT_FORM_ACCESS,
          variables: changes,
        })
        .subscribe(
          (res) => {
            if (res.data) {
              const index = this.forms.findIndex(
                (x) => x.id === res.data?.editForm.id
              );
              const forms = [...this.forms];
              forms[index] = res.data.editForm;
              this.forms = forms;
              this.formsPermissions = this.forms.map((f) => {
                const permissions: FormRolePermissions = {
                  canSeeRecords: [],
                  canCreateRecords: [],
                  canUpdateRecords: [],
                  canDeleteRecords: [],
                };
                for (const permission of this.permissionTypes) {
                  permissions[permission] = get(
                    f,
                    `permissions.${permission}`,
                    []
                  )
                    .filter((x: any) => {
                      switch (permission) {
                        case Permission.CREATE:
                          return x.id === this.role.id;
                        default:
                          return x.role === this.role.id;
                      }
                    })
                    .map((x: any) => {
                      const roleId =
                        permission === Permission.CREATE ? x.id : x.role;
                      return { role: roleId, access: x.access };
                    });
                }
                return {
                  form: f.id,
                  permissions,
                };
              });
            }
            this.updating = false;
          },
          (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.updating = false;
          }
        );
    });
  }
}
