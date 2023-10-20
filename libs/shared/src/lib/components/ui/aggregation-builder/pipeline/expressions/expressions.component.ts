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
  /** Input decorator for form. */
  @Input() form!: UntypedFormGroup;
  /** Input decorator for fields. */
  @Input() fields: any[] = [];
  /** Input decorator for operators. */
  @Input() operators: any = DEFAULT_OPERATORS;
  /** Input decorator for display field. */
  @Input() displayField = true;
  /** Array to hold the list of operators. */
  public operatorsList: string[] = Object.values(this.operators);
  /** Array to hold the list of no field operators. */
  public noFieldOperators = NO_FIELD_OPERATORS;

  /**
   * Aggregation pipeline expression component.
   */
  constructor() {
    super();
  }

  /** OnInit lifecycle hook. */
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

  /**
   * OnChanges lifecycle hook.
   *
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.operators && changes.operators.currentValue) {
      this.operatorsList = Object.values(this.operators);
    }
  }
}
