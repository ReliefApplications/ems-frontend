import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { addFieldsForm } from '../../aggregation-builder-forms';

@Component({
  selector: 'safe-add-field-stage',
  templateUrl: './add-field-stage.component.html',
  styleUrls: ['./add-field-stage.component.scss'],
})
export class SafeAddFieldStageComponent implements OnInit {
  @Input() form!: FormArray;
  @Input() fields: any[] = [];
  @Input() operators: any;

  constructor() {}

  ngOnInit(): void {}

  public addField() {
    this.form.push(addFieldsForm(null));
  }

  public deleteField(index: number) {
    this.form.removeAt(index);
  }
}
