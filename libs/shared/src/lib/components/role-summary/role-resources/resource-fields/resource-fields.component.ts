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

  ngOnInit() {
    this.computeFields(this.filterId.value);
    this.filterId.valueChanges.subscribe((value) => {
      this.computeFields(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resource) {
      this.computeFields(this.filterId.value);
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
    this.selection.clear();
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
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
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
   * i.e. the role has no view / edit permission ( global or filtered ) on the resource.
   *
   * @param permission permission to check
   * @returns true if the role has no matching permission on the resource
   */
  public isAutoGrantDisabled(permission: 'canSee' | 'canUpdate'): boolean {
    const recordsPermission =
      permission === 'canSee' ? 'canSeeRecords' : 'canUpdateRecords';
    return !get(this.resource, `rolePermissions.${recordsPermission}`, null);
  }

  /**
   * Emits an event to toggle the fields auto-grant setting for the given permission.
   *
   * @param permission permission to toggle
   */
  public onToggleAutoGrant(permission: 'canSee' | 'canUpdate') {
    this.onAutoGrantToggle.emit({
      resource: this.resource,
      permission,
    });
  }
}
