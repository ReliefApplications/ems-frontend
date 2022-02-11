import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Accumulators } from '../expressions/operators';

@Component({
  selector: 'safe-group-stage',
  templateUrl: './group-stage.component.html',
  styleUrls: ['./group-stage.component.scss'],
})
export class SafeGroupStageComponent implements OnInit {
  @Input() form!: AbstractControl;
  @Input() fields: any[] = [];
  public operators = Accumulators;

  get formGroup() {
    return this.form as FormGroup;
  }

  get addFields() {
    return this.formGroup.controls.addFields as FormArray;
  }

  constructor() {}

  ngOnInit(): void {}
}
