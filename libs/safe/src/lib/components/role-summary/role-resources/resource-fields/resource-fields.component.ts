import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isEqual, sortBy } from 'lodash';
import { Resource } from '../../../../models/resource.model';
import { Role } from '../../../../models/user.model';
import { FormControl } from '@angular/forms';

export type ResourceField = {
  name: string;
  canSee: boolean;
  canUpdate: boolean;
};

export type FieldAccesses = {
  field: ResourceField;
  permissions: ('canSee' | 'canUpdate')[];
};

/**
 * Component containing table with fields of a resource.
 * In this table, it's possible to toggle if field is visible / editable.
 */
@Component({
  selector: 'safe-resource-fields',
  templateUrl: './resource-fields.component.html',
  styleUrls: ['./resource-fields.component.scss'],
})
export class ResourceFieldsComponent implements OnInit {
  @Input() resource!: Resource;
  @Input() role!: Role;
  @Input() disabled = false;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onToggle = new EventEmitter<{
    resource: Resource;
    field: FieldAccesses;
  }>();

  public filterId = new FormControl<string | null | undefined>(undefined);

  public fields = new Array<ResourceField[]>([]);
  public displayedColumns: string[] = ['name', 'actions'];

  ngOnInit() {
    this.fields = sortBy(
      this.resource.fields.map((field: any) => ({
        name: field.name,
        canSee: !!field.permissions?.canSee?.includes(this.role.id),
        canUpdate: !!field.permissions?.canUpdate?.includes(this.role.id),
      })),
      'name'
    );
    this.filterId.valueChanges.subscribe((value) => {
      this.filterByTemplate(value);
    });
  }

  /**
   * Filter list of fields by template id
   *
   * @param id template id
   */
  private filterByTemplate(id?: string | null) {
    if (id) {
      this.fields = sortBy(
        this.resource.fields
          .filter((field: any) =>
            this.resource.metadata
              ?.find((x) => x.name === field.name)
              ?.usedIn?.find((formId) => isEqual(formId, id))
          )
          .map((field: any) => ({
            name: field.name,
            canSee: !!field.permissions?.canSee?.includes(this.role.id),
            canUpdate: !!field.permissions?.canUpdate?.includes(this.role.id),
          })),
        'name'
      );
    } else {
      this.fields = sortBy(
        this.resource.fields.map((field: any) => ({
          name: field.name,
          canSee: !!field.permissions?.canSee?.includes(this.role.id),
          canUpdate: !!field.permissions?.canUpdate?.includes(this.role.id),
        })),
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
    const fieldsPermissions: FieldAccesses = {
      field,
      permissions: [permission],
    };
    // if canSee is toggled off, we should remove canUpdate as well
    if (permission === 'canSee' && field.canSee && field.canUpdate) {
      fieldsPermissions.permissions.push('canUpdate');
    }
    this.onToggle.emit({
      resource: this.resource,
      field: fieldsPermissions,
    });
  }
}
