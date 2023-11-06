import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { createStyleForm } from '../query-builder-forms';

/**
 * Component to display the styling menu
 */
@Component({
  selector: 'shared-tab-style',
  templateUrl: './tab-style.component.html',
  styleUrls: ['./tab-style.component.scss'],
})
export class TabStyleComponent implements OnInit {
  @Input() form!: UntypedFormArray;
  @Input() editedStyleForm: UntypedFormGroup | null = null;
  @Input() scalarFields: any[] = [];
  @Input() metaFields: any = {};
  @Input() canDelete = false;
  @Input() query: any;
  @ViewChild('childTemplate', { read: ViewContainerRef })
  childTemplate?: ViewContainerRef;

  /**
   * Getter for the styles
   *
   * @returns The styles in an array
   */
  get styles$(): UntypedFormArray {
    return this.form.get('style') as UntypedFormArray;
  }

  public fieldForm: UntypedFormGroup | null = null;
  public fields: any[] = [];

  /**
   * Creates a new form group and add it to the array of styles.
   */
  public onAdd(): void {
    const styleForm = createStyleForm(null);
    this.form.push(styleForm);
  }

  ngOnInit(): void {
    this.fields = this.query.fields;
  }

  /**
   * Opens form edition for element at index.
   *
   * @param index index of style to edit.
   */
  public onEdit(index: number): void {
    this.editedStyleForm = this.form.at(index) as UntypedFormGroup;
  }

  /**
   * Deletes a style at index.
   *
   * @param index index of style to delete.
   */
  public onDelete(index: number): void {
    this.form.removeAt(index);
  }

  /**
   * Closes edition of current style.
   */
  public onClose(): void {
    this.editedStyleForm = null;
  }

  /**
   * Handles the application of a style to fields
   *
   * @param value Wether the style is required or not
   */
  public onApplyTo(value: boolean): void {
    if (value) {
      this.fieldForm?.get('fields')?.setValidators(Validators.required);
    } else {
      this.fieldForm?.get('fields')?.clearValidators();
    }
    this.fieldForm?.get('fields')?.updateValueAndValidity();
  }
}
