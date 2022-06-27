import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { createStyleForm } from '../query-builder-forms';

/**
 * Component to display the styling menu
 */
@Component({
  selector: 'safe-tab-style',
  templateUrl: './tab-style.component.html',
  styleUrls: ['./tab-style.component.scss'],
})
export class SafeTabStyleComponent implements OnInit {
  @Input() form!: FormArray;
  @Input() editedStyleForm: FormGroup | null = null;
  @Input() fields: any[] = [];
  @Input() scalarFields: any[] = [];
  @Input() metaFields: any = {};
  @Input() canDelete = false;
  @ViewChild('childTemplate', { read: ViewContainerRef })
  childTemplate?: ViewContainerRef;

  /**
   * Getter for the styles
   *
   * @returns The styles in an array
   */
  get styles$(): FormArray {
    return this.form.get('style') as FormArray;
  }
  public fieldForm: FormGroup | null = null;

  /**
   * Constructor for the styling component
   */
  constructor() {}

  ngOnInit(): void {}

  /**
   * Creates a new form group and add it to the array of styles.
   */
  public onAdd(): void {
    const styleForm = createStyleForm(null);
    this.form.push(styleForm);
  }

  /**
   * Opens form edition for element at index.
   *
   * @param index index of style to edit.
   */
  public onEdit(index: number): void {
    this.editedStyleForm = this.form.at(index) as FormGroup;
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
