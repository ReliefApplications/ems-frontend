import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';

/** Form option and ordered fields returned by the resource forms REST endpoint. */
export interface LayoutFormFields {
  id: string;
  name: string;
  fields: string[];
}

/**
 * Dropdown used to filter the available layout fields by form.
 * The dropdown is always rendered, but stays disabled with a loading
 * indicator until the forms are provided. Once a form is selected, a
 * suffix button allows clearing the filter.
 */
@Component({
  selector: 'shared-form-filter',
  templateUrl: './form-filter.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormWrapperModule,
    SelectMenuModule,
    SpinnerModule,
    ButtonModule,
    TooltipModule,
  ],
})
export class FormFilterComponent implements OnChanges {
  /** Forms that can be used to filter fields. */
  @Input() forms: LayoutFormFields[] = [];
  /** Whether the forms are still being loaded. */
  @Input() loading = false;
  /** Whether the dropdown should be disabled. */
  @Input() disabled = false;
  /** Currently selected form id, empty string for no filter. */
  @Input() selectedFormId = '';
  /** Emits the selected form id whenever the selection changes. */
  @Output() selectedFormIdChange = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    // Reset the selection when the selected form is no longer available
    if (
      changes.forms &&
      this.selectedFormId &&
      !this.forms.some((form) => form.id === this.selectedFormId)
    ) {
      this.onSelectionChange('');
    }
  }

  /**
   * Propagates the new selection to the parent component.
   *
   * @param formId Selected form id.
   */
  public onSelectionChange(formId: string): void {
    this.selectedFormId = formId;
    this.selectedFormIdChange.emit(formId);
  }
}
