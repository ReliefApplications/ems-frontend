import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Step } from 'dist/who-ems/public-api';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnChanges {

  // === FORM ===
  public settingsForm: FormGroup;

  // === INPUTS ===
  @Input() selectedStep: Step;
  @Input() isLastStep: number;
  @Input() fields: any[];

  // === OUTPUTS ===
  @Output() formValue: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.settingsForm = this.formBuilder.group({
      buttonName: [this.selectedStep.settings && this.selectedStep.settings.buttonName ? this.selectedStep.settings.buttonName :
        (!this.isLastStep) ? 'Next' : 'Publish'],
      autoSave: [this.selectedStep.settings && this.selectedStep.settings.autoSave ?
        this.selectedStep.settings.autoSave : null],
      modifySelectedRows: [this.selectedStep.settings && this.selectedStep.settings.modifySelectedRows ?
          this.selectedStep.settings.modifySelectedRows : null],
      modifiedField: [this.selectedStep.settings && this.selectedStep.settings.modifiedField ?
        this.selectedStep.settings.modifiedField : null],
      modifiedInputValue: [this.selectedStep.settings && this.selectedStep.settings.modifiedInputValue ?
        this.selectedStep.settings.modifiedInputValue : null],
    });
  }

  onSave(): void {
    this.formValue.emit(this.settingsForm.value);
  }

  onClose(): void {
    this.formValue.emit(false);
  }

  compareFields(field1: any, field2: any): boolean {
    return field1.name === field2.name;
  }

}
