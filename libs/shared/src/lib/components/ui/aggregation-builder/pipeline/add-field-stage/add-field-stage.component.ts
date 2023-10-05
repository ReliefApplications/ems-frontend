import { Component, Input } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { addFieldsForm } from '../../aggregation-builder-forms';

/**
 * Add Fields aggregation pipeline stage.
 */
@Component({
  selector: 'shared-add-field-stage',
  templateUrl: './add-field-stage.component.html',
  styleUrls: ['./add-field-stage.component.scss'],
})
export class AddFieldStageComponent {
  @Input() form!: UntypedFormArray;
  @Input() fields: any[] = [];
  @Input() operators: any;
  @Input() displayName = true;

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
