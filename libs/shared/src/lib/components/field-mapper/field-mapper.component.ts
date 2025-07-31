import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormArray,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  ExpansionPanelModule,
  FormWrapperModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Resource field mapper component.
 */
@Component({
  selector: 'shared-field-mapper',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    ExpansionPanelModule,
    MonacoEditorModule,
    SelectMenuModule,
    FormWrapperModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  templateUrl: './field-mapper.component.html',
  styleUrls: ['./field-mapper.component.scss'],
})
export class FieldMapperComponent implements OnInit {
  /** Resource fields to map */
  @Input() fields: any[] = [];
  /** Parent form group */
  @Input() formGroupInstance!: FormGroup;
  /** Disable expansion panel */
  @Input() disabled = false;
  /** Open raw JSON */
  public openRawJSON = false;
  /** Monaco editor configuration, for raw edition */
  public editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    fixedOverflowWidgets: true,
  };
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /** @returns pull job mapping as form array */
  get mappingArray(): UntypedFormArray {
    return this.formGroupInstance.get('mapping') as UntypedFormArray;
  }

  /**
   * Resource field mapper component.
   *
   * @param fb Angular form builder
   */
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.mappingArray.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.synchronizeFormValueData();
        },
      });
  }

  /**
   * Filters fields so we cannot add a multiple mapping for the same one.
   *
   * @param name Field name.
   * @returns Filtered fields.
   */
  public filteredFields(name: string): any[] {
    return this.fields.filter(
      (field) =>
        field.name === name ||
        !this.mappingArray.value?.some((x: any) => x.name === field.name)
    );
  }

  /**
   * Toggles the edit mode and update form values accordingly.
   */
  toggleRawJSON(): void {
    this.synchronizeFormValueData();
    this.openRawJSON = !this.openRawJSON;
  }

  /**
   * Synchronize mapping of the form value to the raw mapping if user don't want to open raw JSON
   */
  private synchronizeFormValueData() {
    if (!this.openRawJSON) {
      const mapping = this.formGroupInstance
        .get('mapping')
        ?.value.reduce(
          (o: any, field: any) => ({ ...o, [field.name]: field.value }),
          {}
        );
      this.formGroupInstance
        .get('rawMapping')
        ?.setValue(JSON.stringify(mapping, null, 2));
    }
  }

  /**
   * Removes element from the mapping
   *
   * @param index mapping element index.
   */
  onDeleteElement(index: number): void {
    this.mappingArray.removeAt(index);
  }

  /**
   * Adds new element to the mapping.
   */
  onAddElement(): void {
    this.mappingArray.push(
      this.fb.group({
        name: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }
}
