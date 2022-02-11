import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Accumulators } from './operators';

@Component({
  selector: 'safe-expressions',
  templateUrl: './expressions.component.html',
  styleUrls: ['./expressions.component.scss'],
})
export class SafeExpressionsComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() fields: any[] = [];
  @Input() operators = Accumulators;
  public operatorsList: string[] = Object.values(this.operators);

  constructor() {}

  ngOnInit(): void {
    this.form.get('operator')?.valueChanges.subscribe((operator: string) => {
      if (operator) {
        if (operator === Accumulators.COUNT) {
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
