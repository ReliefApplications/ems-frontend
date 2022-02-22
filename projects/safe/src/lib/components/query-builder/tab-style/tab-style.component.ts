import {
  Component,
  ComponentFactory,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { createStyleForm } from '../query-builder-forms';

@Component({
  selector: 'safe-tab-style',
  templateUrl: './tab-style.component.html',
  styleUrls: ['./tab-style.component.scss'],
})
export class SafeTabStyleComponent implements OnInit {
  @Input() factory?: ComponentFactory<any>;
  @Input() form!: FormArray;
  @Input() editedStyleForm: FormGroup | null = null;
  @Input() availableFields: any[] = [];
  @Input() scalarFields: any[] = [];
  @Input() metaFields: any = {};
  @Input() canDelete = false;
  @ViewChild('childTemplate', { read: ViewContainerRef })
  childTemplate?: ViewContainerRef;

  get styles$(): FormArray {
    return this.form.get('style') as FormArray;
  }
  public fieldForm: FormGroup | null = null;

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

  public onApplyTo(value: boolean): void {
    if (value) {
      this.fieldForm?.get('fields')?.setValidators(Validators.required);
    } else {
      this.fieldForm?.get('fields')?.clearValidators();
    }
    this.fieldForm?.get('fields')?.updateValueAndValidity();
  }
}
