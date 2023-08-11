import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { isEqual, sortBy } from 'lodash';
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
  selector: 'safe-resource-fields',
  templateUrl: './resource-fields.component.html',
  styleUrls: ['./resource-fields.component.scss'],
})
export class ResourceFieldsComponent implements OnInit, OnChanges {
  @Input() resource!: Resource;
  @Input() role!: Role;
  @Input() disabled = false;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onToggle = new EventEmitter<{
    resource: Resource;
    field: ResourceField;
    permission: 'canSee' | 'canUpdate';
  }>();

  public filterId = new FormControl<string | null | undefined>(undefined);

  public fields = new Array<ResourceField>();
  public displayedColumns: string[] = ['name', 'actions'];

  private updatedField: { index: number; permission: 'canSee' | 'canUpdate' } =
    { index: -1, permission: 'canSee' };

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resource && this.updatedField.index !== -1) {
      const field = this.fields[this.updatedField.index];
      if (this.updatedField.permission === 'canSee') {
        field.canSee = !field.canSee;
      } else {
        field.canUpdate = !field.canUpdate;
      }
      this.updatedField.index = -1;
    }
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
   * @param index Index of the field to toggle permission for.
   * @param field Field to toggle permission for.
   * @param permission Permission type to toggle.
   */
  public onEditFieldAccess(
    index: number,
    field: ResourceField,
    permission: 'canSee' | 'canUpdate'
  ) {
    // Save field updated
    this.updatedField = { index, permission };
    this.onToggle.emit({
      field,
      permission,
      resource: this.resource,
    });
  }
}
