import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { DEFAULT_OPERATORS, NO_FIELD_OPERATORS } from './operators';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/**
 * Aggregation pipeline expression component.
 */
@Component({
  selector: 'shared-expressions',
  templateUrl: './expressions.component.html',
  styleUrls: ['./expressions.component.scss'],
})
export class ExpressionsComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  @Input() form!: UntypedFormGroup;
  @Input() fields: any[] = [];
  @Input() operators: any = DEFAULT_OPERATORS;
  @Input() displayField = true;
  public operatorsList: string[] = Object.values(this.operators);
  public noFieldOperators = NO_FIELD_OPERATORS;

  /**
   * Aggregation pipeline expression component.
   */
  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.displayField) {
      this.form
        .get('operator')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((operator: string) => {
          if (operator) {
            if (this.noFieldOperators.includes(operator)) {
              this.form.get('field')?.setValue('');
              this.form.get('field')?.setValidators(null);
            } else {
              this.form.get('field')?.setValidators(Validators.required);
            }
            this.form.get('field')?.updateValueAndValidity();
          }
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.operators && changes.operators.currentValue) {
      this.operatorsList = Object.values(this.operators);
    }
  }
}
