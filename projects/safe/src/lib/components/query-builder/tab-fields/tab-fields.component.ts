import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { addNewField } from '../query-builder-forms';
import { SafeQueryBuilderComponent } from '../query-builder.component';

/**
 * Component used for the selection of fields to display the fields in tabs
 */
@Component({
  selector: 'safe-tab-fields',
  templateUrl: './tab-fields.component.html',
  styleUrls: ['./tab-fields.component.scss'],
})
export class SafeTabFieldsComponent implements OnInit, OnChanges {
  @Input() form: FormArray = new FormArray([]);
  @Input() fields: any[] = [];
  @ViewChild('childTemplate', { read: ViewContainerRef })
  childTemplate?: ViewContainerRef;

  public availableFields: any[] = [];
  public selectedFields: any[] = [];
  public fieldForm: FormGroup | null = null;

  public searchAvailable = '';
  public searchSelected = '';

  /**
   * The constructor function is a special function that is called when a new instance of the class is created.
   *
   * @param queryBuilder The service used to build queries
   */
  constructor(private queryBuilder: QueryBuilderService) {}

  ngOnInit(): void {
    const selectedFields: string[] = this.form.getRawValue().map((x) => x.name);
    this.availableFields = this.fields
      .slice()
      .filter((x) => !selectedFields.includes(x.name));
    this.selectedFields = selectedFields.map(
      (x) => this.fields.find((f) => f.name === x) || { name: x }
    );
    this.selectedFields.forEach((x, index) => {
      if (!x.type) {
        this.form.at(index).setErrors({ invalid: true });
      }
    });
  }

  ngOnChanges(): void {
    const selectedFields: string[] = this.form.getRawValue().map((x) => x.name);
    this.availableFields = this.fields
      .slice()
      .filter((x) => !selectedFields.includes(x.name));
    this.selectedFields = selectedFields.map(
      (x) => this.fields.find((f) => f.name === x) || { name: x }
    );
  }

  /**
   * Handles the dropping of the field in a container
   *
   * @param event The event involved in the drop
   */
  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      // Move into same list of fields
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (this.selectedFields === event.container.data) {
        // Move the selected field, to update the form
        const fieldToMove = this.form.at(event.previousIndex);
        this.form.removeAt(event.previousIndex);
        this.form.insert(event.currentIndex, fieldToMove);
      }
    } else {
      // Move into different list
      if (this.selectedFields === event.previousContainer.data) {
        // Move from selected fields
        if (
          this.fieldForm === (this.form.at(event.previousIndex) as FormGroup)
        ) {
          this.fieldForm = new FormGroup({});
        }
        const index = this.getItemIndex(
          this.selectedFields,
          this.searchSelected,
          event.previousIndex
        );
        if (this.form.at(index).errors?.invalid) {
          this.form.removeAt(index);
          this.selectedFields.splice(index, 1);
        } else {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            index,
            event.currentIndex
          );
          this.form.removeAt(index);
        }
      } else {
        const index = this.getItemIndex(
          this.availableFields,
          this.searchAvailable,
          event.previousIndex
        );
        // Move to selected fields
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          index,
          event.currentIndex
        );
        this.form.insert(
          event.currentIndex,
          addNewField(this.selectedFields[event.currentIndex], true)
        );
      }
    }
  }

  /**
   * Get item index in list, from search text and search index.
   *
   * @param list list to find item in
   * @param searchText search text used for predicate
   * @param index index of item, in searched list
   * @returns item index in non-searched list
   */
  private getItemIndex(list: any[], searchText: string, index: number) {
    if (searchText.length < 1) {
      return index;
    } else {
      const filteredList = list.filter((x) =>
        x.name.toLowerCase().includes(searchText.toLowerCase())
      );
      const item = filteredList[index];
      return list.findIndex((x) => x.name === item.name);
    }
  }

  /**
   * Handles the closure field event
   */
  public onCloseField(): void {
    this.fieldForm = null;
  }

  /**
   * Handles the event when clicking on the edit button when a field is selected
   *
   * @param index Index of the field
   */
  public onEdit(index: number): void {
    this.fieldForm = this.form.at(index) as FormGroup;
    if (this.fieldForm.value.kind !== 'SCALAR') {
      if (this.childTemplate) {
        const componentRef = this.childTemplate.createComponent(
          SafeQueryBuilderComponent
        );
        componentRef.instance.setForm(this.fieldForm);
        componentRef.instance.canExpand = this.fieldForm.value.kind === 'LIST';
        componentRef.instance.closeField.subscribe(() => {
          this.onCloseField();
          componentRef.destroy();
        });
      }
    }
  }

  /**
   * Deletes the field
   *
   * @param index Index of the field to remove
   */
  public onDelete(index: number): void {
    this.form.removeAt(index);
    this.selectedFields.splice(index, 1);
  }
}
