import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

/**
 * Component that handles labeling
 */
@Component({
  selector: 'shared-label-stage',
  templateUrl: './label-stage.component.html',
  styleUrls: ['./label-stage.component.scss'],
})
export class LabelStageComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() fields: any[] = [];
  @Input() showLimit = false;
  @Input() metaFields: any[] = [];

  /** List of available fields that could have choices */
  public choiceFields: string[] = [];

  /**
   * Component that handles labeling
   */
  constructor() {
    super();
  }

  /** Setup form behavior */
  ngOnInit(): void {
    this.form
      .get('field')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((field) => {
        if (this.choiceFields.includes(field)) {
          this.form.get('copyFrom')?.setValue(field);
        } else {
          this.form.get('copyFrom')?.setValue(null);
        }
      });
  }

  /**
   * Recalculates the choice fields based on current inputted fields
   *
   * @param changes the changes object
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fields) {
      this.choiceFields = Object.entries(this.metaFields)
        .filter(([, value]) =>
          [
            'dropdown',
            'checkbox',
            'radiogroup',
            'tagbox',
            'matrixdropdown',
            'matrixdynamic',
          ].includes(value.type)
        )
        .map(([, value]) => value.name);
    }
  }
}
