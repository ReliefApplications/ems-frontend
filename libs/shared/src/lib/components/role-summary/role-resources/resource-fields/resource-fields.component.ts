import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { get, isEqual, sortBy } from 'lodash';
import { Resource } from '../../../../models/resource.model';
import { Role } from '../../../../models/user.model';
import { FormControl } from '@angular/forms';

type ResourceField = {
  name: string;
  canSee: boolean;
  canUpdate: boolean;
};

/** Field permissions that can be granted to a role */
const FIELD_PERMISSIONS = ['canSee', 'canUpdate'] as const;

/**
 * Component containing table with fields of a resource.
 * In this table, it's possible to toggle if field is visible / editable.
 */
@Component({
  selector: 'shared-resource-fields',
  templateUrl: './resource-fields.component.html',
  styleUrls: ['./resource-fields.component.scss'],
})
export class ResourceFieldsComponent implements OnInit, OnChanges {
  /** Resource */
  @Input() resource!: Resource;
  /** Role */
  @Input() role!: Role;
  /** Disabled flag */
  @Input() disabled = false;
  /** Event emitter for toggle */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onToggle = new EventEmitter<{
    resource: Resource;
    field: ResourceField;
    permission: 'canSee' | 'canUpdate';
  }>();
  /** Event emitter for bulk toggle */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onBulkToggle = new EventEmitter<{
    resource: Resource;
    fields: ResourceField[];
    permission: 'canSee' | 'canUpdate';
    grant: boolean;
  }>();
  /** Event emitter for fields auto-grant toggle */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAutoGrantToggle = new EventEmitter<{
    resource: Resource;
    permission: 'canSee' | 'canUpdate';
  }>();

  /** Filter template id */
  public filterId = new FormControl<string | null | undefined>(undefined);

  /** Fields */
  public fields = new Array<ResourceField>();
  /** Displayed columns */
  public displayedColumns: string[] = ['select', 'name', 'actions'];
  /** Selection model for bulk actions */
  public selection = new SelectionModel<ResourceField>(true, []);
  /**
   * Fields auto-grant checkboxes, one control per permission.
   * A control is used rather than a [checked] binding because ui-checkbox flips
   * its own internal state on click: only writing through the control forces the
   * view back in sync when the server state did not change, e.g. after a failed
   * mutation.
   */
  public autoGrant: Record<'canSee' | 'canUpdate', FormControl<boolean>> = {
    canSee: new FormControl<boolean>(false, { nonNullable: true }),
    canUpdate: new FormControl<boolean>(false, { nonNullable: true }),
  };

  ngOnInit() {
    this.computeFields(this.filterId.value);
    this.filterId.valueChanges.subscribe((value) => {
      this.computeFields(value);
    });
    FIELD_PERMISSIONS.forEach((permission) => {
      this.autoGrant[permission].valueChanges.subscribe(() => {
        this.onAutoGrantToggle.emit({ resource: this.resource, permission });
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resource) {
      this.computeFields(this.filterId.value);
    }
    // `disabled` flips back to false as soon as a mutation settles, which is the
    // only signal available when it failed and left the resource untouched.
    if (changes.resource || changes.disabled) {
      this.syncAutoGrantControls();
    }
  }

  /**
   * Check if field has access for role
   *
   * @param field field
   * @returns field with access data
   */
  private hasFieldAccess = (field: any) => ({
    name: field.name,
    canSee: !!field.permissions?.canSee?.includes(this.role.id),
    canUpdate: !!field.permissions?.canUpdate?.includes(this.role.id),
  });

  /**
   * Recompute the list of fields (with up to date access data) from the resource input,
   * filtered by template id if one is selected.
   *
   * @param id template id
   */
  private computeFields(id?: string | null) {
    const selectedNames = new Set(this.selection.selected.map((x) => x.name));
    if (id) {
      this.fields = sortBy(
        this.resource.fields
          .filter((field: any) =>
            this.resource.metadata
              ?.find((x) => x.name === field.name)
              ?.usedIn?.find((formId) => isEqual(formId, id))
          )
          .map(this.hasFieldAccess),
        'name'
      );
    } else {
      this.fields = sortBy(
        this.resource.fields.map(this.hasFieldAccess),
        'name'
      );
    }
    // Fields are rebuilt as new objects on every refresh, so the selection is
    // remapped onto them instead of being dropped, keeping the bulk actions
    // usable across consecutive edits. Fields no longer displayed are removed.
    this.selection.clear();
    const stillSelected = this.fields.filter((field) =>
      selectedNames.has(field.name)
    );
    if (stillSelected.length) {
      this.selection.select(...stillSelected);
    }
  }

  /**
   * Track fields by name, so toggling a permission does not destroy and rebuild
   * every row of the table.
   *
   * @param index index of the field in the table
   * @param field field of the current row
   * @returns unique value for all unique inputs
   */
  public trackByFieldName(index: number, field: ResourceField): string {
    return field.name;
  }

  /**
   * Emits an event to toggle if field is visible / editable.
   *
   * @param field Field to toggle permission for.
   * @param permission Permission type to toggle.
   */
  public onEditFieldAccess(
    field: ResourceField,
    permission: 'canSee' | 'canUpdate'
  ) {
    this.onToggle.emit({
      field,
      permission,
      resource: this.resource,
    });
  }

  /**
   * Whether the number of selected fields matches the total number of displayed fields.
   *
   * @returns True if it matches, else False
   */
  public isAllSelected(): boolean {
    return (
      this.fields.length > 0 &&
      this.selection.selected.length === this.fields.length
    );
  }

  /**
   * Selects all displayed fields if they are not all selected; otherwise clears selection.
   */
  public masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.fields.forEach((field) => this.selection.select(field));
  }

  /**
   * Get the label for the checkbox on the passed row
   *
   * @param field the field of the current row, if any
   * @returns the label for the checkbox
   */
  public checkboxLabel(field?: ResourceField): string {
    if (!field) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(field) ? 'deselect' : 'select'} row ${
      field.name
    }`;
  }

  /**
   * Whether all currently selected fields already have the given permission.
   *
   * @param permission permission to check
   * @returns true if every selected field has the permission granted
   */
  public bulkPermissionGranted(permission: 'canSee' | 'canUpdate'): boolean {
    return this.selection.selected.every((field) => field[permission]);
  }

  /**
   * Emits an event to bulk toggle the given permission for all selected fields,
   * granting it if not every selected field already has it, revoking it otherwise.
   *
   * @param permission permission to bulk toggle
   */
  public onBulkEditFieldAccess(permission: 'canSee' | 'canUpdate') {
    this.onBulkToggle.emit({
      resource: this.resource,
      fields: [...this.selection.selected],
      permission,
      grant: !this.bulkPermissionGranted(permission),
    });
  }

  /**
   * Whether the fields auto-grant checkbox for the given permission is checked.
   *
   * @param permission permission to check
   * @returns true if new fields are currently auto-granted this permission for the role
   */
  public isAutoGrantChecked(permission: 'canSee' | 'canUpdate'): boolean {
    return !!get(
      this.resource,
      `rolePermissions.autoGrantFields${
        permission === 'canSee' ? 'CanSee' : 'CanUpdate'
      }`,
      false
    );
  }

  /**
   * Whether the fields auto-grant checkbox for the given permission should be disabled,
   * i.e. the role holds none of the record permissions making it eligible for that
   * field permission. Mirrors the backend eligibility rule, where the right to create
   * records also makes a role eligible, so that a create-only role can still opt out.
   *
   * @param permission permission to check
   * @returns true if the role has no matching permission on the resource
   */
  public isAutoGrantDisabled(permission: 'canSee' | 'canUpdate'): boolean {
    const recordsPermission =
      permission === 'canSee' ? 'canSeeRecords' : 'canUpdateRecords';
    return (
      !get(this.resource, `rolePermissions.${recordsPermission}`, null) &&
      !get(this.resource, 'rolePermissions.canCreateRecords', null)
    );
  }

  /**
   * Write the server state of the fields auto-grant settings back into the
   * checkbox controls, and update their disabled state.
   */
  private syncAutoGrantControls(): void {
    FIELD_PERMISSIONS.forEach((permission) => {
      const control = this.autoGrant[permission];
      const disabled = this.disabled || this.isAutoGrantDisabled(permission);
      if (disabled !== control.disabled) {
        if (disabled) {
          control.disable({ emitEvent: false });
        } else {
          control.enable({ emitEvent: false });
        }
      }
      // Always written, even when unchanged, to revert an optimistic toggle the
      // checkbox applied to itself on click.
      control.setValue(this.isAutoGrantChecked(permission), {
        emitEvent: false,
      });
    });
  }
}
