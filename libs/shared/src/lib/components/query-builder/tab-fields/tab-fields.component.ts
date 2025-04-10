import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { INLINE_EDITOR_CONFIG } from '../../../const/tinymce.const';
import { EditorService } from '../../../services/editor/editor.service';
import { HtmlParserService } from '../../../services/html-parser/html-parser.service';
import { addNewField } from '../query-builder-forms';
import { QueryBuilderComponent } from '../query-builder.component';

/**
 * Component used for the selection of fields to display the fields in tabs
 */
@Component({
  selector: 'shared-tab-fields',
  templateUrl: './tab-fields.component.html',
  styleUrls: ['./tab-fields.component.scss'],
})
export class TabFieldsComponent implements OnInit, OnChanges {
  /** Current form array */
  @Input() form: UntypedFormArray = new UntypedFormArray([]);
  /** Should disable */
  @Input() disabled = false;
  /** All fields */
  @Input() fields: any[] = [];
  /** Should show limit input */
  @Input() showLimit = false;
  /** Is the column width field displayed */
  @Input() showColumnWidth = false;
  /** Reference to child template, in order to inject query builder component */
  @ViewChild('childTemplate', { read: ViewContainerRef })
  childTemplate?: ViewContainerRef;
  /** Available fields */
  public availableFields: any[] = [];
  /** Selected fields */
  public selectedFields: any[] = [];
  /** Current field form group */
  public fieldForm: UntypedFormGroup | null = null;
  /** Search on available fields */
  public searchAvailable = '';
  /** Search on selected fields */
  public searchSelected = '';
  /** Tinymce editor configuration */
  public editor: any = INLINE_EDITOR_CONFIG;
  /**
   *Event emitted for the selected fields
   */
  @Output() droppedFields = new EventEmitter();

  /**
   * Component used for the selection of fields to display the fields in tabs.
   *
   * @param editorService Editor service used to get main URL and current language
   * @param htmlParserService Html parser service to parse the values for html layout
   */
  constructor(
    private editorService: EditorService,
    private htmlParserService: HtmlParserService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    this.setSelectedFields();
    this.checkfieldsIsValid();
  }

  /**
   * Checking that Selected fields form are valid or not
   */
  checkfieldsIsValid() {
    this.selectedFields.forEach((x, index) => {
      if (!x?.type) {
        this.form.at(index).setErrors({ invalid: true });
      }
      if (x?.type?.kind === 'LIST' || x?.type?.kind === 'OBJECT') {
        this.form.at(index).getRawValue().fields?.length === 0 ||
        this.form.at(index).getRawValue().fields === null
          ? this.form.at(index).setErrors({ invalid: true })
          : '';
      }
    });
  }

  ngOnChanges(): void {
    this.setSelectedFields();
  }

  /**
   * Set selected and available fields taking in account current selection in the form
   */
  private setSelectedFields() {
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
          this.fieldForm ===
          (this.form.at(event.previousIndex) as UntypedFormGroup)
        ) {
          this.fieldForm = new UntypedFormGroup({});
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
        if (index > -1) {
          this.droppedFields.emit(this.availableFields[index]);
        }
        // Move to selected fields
        transferArrayItem(
          event.previousContainer.data,
          event?.container?.data,
          index,
          event.currentIndex
        );
        this.form?.insert(
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
    this.checkfieldsIsValid();
  }

  /**
   * Handles the event when clicking on the edit button when a field is selected
   *
   * @param index Index of the field
   */
  public onEdit(index: number): void {
    this.fieldForm = this.form.at(index) as UntypedFormGroup;
    if (this.fieldForm.value.kind === 'SCALAR') {
      // Setup field format editor auto completer
      const dataKeys = this.htmlParserService.getDataKeys([
        { name: this.fieldForm.controls.name.value },
      ]);
      const calcKeys = this.htmlParserService.getCalcKeys();
      const keys = dataKeys.concat(calcKeys);

      this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
    } else {
      if (this.childTemplate) {
        const componentRef = this.childTemplate.createComponent(
          QueryBuilderComponent
        );
        componentRef.instance.setForm(this.fieldForm);
        componentRef.instance.canExpand = this.fieldForm.value.kind === 'LIST';
        componentRef.instance.showLimit = this.showLimit;
        componentRef.instance.showColumnWidth = this.showColumnWidth;
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
