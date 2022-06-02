import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DEFAULT_OPERATORS, NO_FIELD_OPERATORS } from './operators';

/**
 * Aggregation pipeline expression component.
 */
@Component({
  selector: 'safe-expressions',
  templateUrl: './expressions.component.html',
  styleUrls: ['./expressions.component.scss'],
})
export class SafeExpressionsComponent implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() fields: any[] = [];
  @Input() operators: any = DEFAULT_OPERATORS;
  @Input() displayField = true;
  public operatorsList: string[] = Object.values(this.operators);
  public noFieldOperators = NO_FIELD_OPERATORS;

  constructor() {}

  ngOnInit(): void {
    if (this.displayField) {
      this.form.get('operator')?.valueChanges.subscribe((operator: string) => {
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
