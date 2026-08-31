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
  canDeleteFiles?: boolean;
  isFileField?: boolean;
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
    permission: 'canSee' | 'canUpdate' | 'canDeleteFiles';
  }>();

  /** Filter template id */
  public filterId = new FormControl<string | null | undefined>(undefined);

  /** Fields */
  public fields = new Array<ResourceField>();
  /** Displayed columns */
  public displayedColumns: string[] = ['name', 'actions'];

  /** Updated field */
  private updatedField: {
    index: number;
    permission: 'canSee' | 'canUpdate' | 'canDeleteFiles';
  } = { index: -1, permission: 'canSee' };

  ngOnInit() {
    this.fields = sortBy(this.resource.fields.map(this.hasFieldAccess), 'name');
    this.filterId.valueChanges.subscribe((value) => {
      this.filterByTemplate(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resource && this.updatedField.index !== -1) {
      const field = this.fields[this.updatedField.index];
      if (this.updatedField.permission === 'canSee') {
        field.canSee = !field.canSee;
      } else if (this.updatedField.permission === 'canUpdate') {
        field.canUpdate = !field.canUpdate;
      } else if (this.updatedField.permission === 'canDeleteFiles') {
        field.canDeleteFiles = !field.canDeleteFiles;
      }
      this.updatedField.index = -1;
    }
  }

  /**
   * Check if field has access for role
   *
   * @param field field
   * @returns field with access data
   */
  private hasFieldAccess = (field: any) => {
    const isFileField = field.type === 'file' || field.meta?.type === 'file';
    const canDeleteFiles = field.permissions?.canDeleteFiles
      ? !!field.permissions.canDeleteFiles.includes(this.role.id)
      : !!field.permissions?.canUpdate?.includes(this.role.id);

    return {
      name: field.name,
      canSee: !!field.permissions?.canSee?.includes(this.role.id),
      canUpdate: !!field.permissions?.canUpdate?.includes(this.role.id),
      canDeleteFiles,
      isFileField,
    };
  };

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
   * Emits an event to toggle if field is visible / editable / delete files allowed.
   *
   * @param index Index of the field to toggle permission for.
   * @param field Field to toggle permission for.
   * @param permission Permission type to toggle.
   */
  public onEditFieldAccess(
    index: number,
    field: ResourceField,
    permission: 'canSee' | 'canUpdate' | 'canDeleteFiles'
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
