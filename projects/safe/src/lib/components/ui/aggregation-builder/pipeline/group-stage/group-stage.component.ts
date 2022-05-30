import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Accumulators } from '../expressions/operators';

/**
 * Group Stage pipeline component.
 */
@Component({
  selector: 'safe-group-stage',
  templateUrl: './group-stage.component.html',
  styleUrls: ['./group-stage.component.scss'],
})
export class SafeGroupStageComponent implements OnInit {
  @Input() form!: AbstractControl;
  @Input() fields: any[] = [];
  @Input() charType!: string;
  public operators = Accumulators;
  public showGroupByStages = false;

  get formGroup() {
    return this.form as FormGroup;
  }

  get addFields() {
    return this.formGroup.controls.addFields as FormArray;
  }

  constructor() {}

  ngOnInit(): void {
    if (
      ['bar', 'column', 'line'].includes(this.charType) &&
      this.formGroup.controls.groupBySeries.value
    ) {
      this.revealGroupByStages();
    }
  }

  revealGroupByStages() {
    this.showGroupByStages = true;
  }
}
