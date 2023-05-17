import { Component, Input } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { addFieldsForm } from '../../aggregation-builder-forms';
import { Variant, Category } from '@oort-front/ui';

/**
 * Add Fields aggregation pipeline stage.
 */
@Component({
  selector: 'safe-add-field-stage',
  templateUrl: './add-field-stage.component.html',
  styleUrls: ['./add-field-stage.component.scss'],
})
export class SafeAddFieldStageComponent {
  @Input() form!: UntypedFormArray;
  @Input() fields: any[] = [];
  @Input() operators: any;
  @Input() displayName = true;

  // === UI VARIANT AND CATEGORY ===
  public variant = Variant;
  public category = Category;

  /**
   * Adds new addField configuration to the pipeline.
   */
  public addField() {
    this.form.push(addFieldsForm(null, this.displayName));
  }

  /**
   * Deletes addField configuration.
   *
   * @param index index of configuration to remove.
   */
  public deleteField(index: number) {
    this.form.removeAt(index);
  }
}
