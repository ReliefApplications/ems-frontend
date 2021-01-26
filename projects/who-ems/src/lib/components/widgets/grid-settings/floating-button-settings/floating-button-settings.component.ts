import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel } from 'projects/who-ems/src/lib/models/channel.model';

const DISABLED_FIELDS = ['id', 'createdAt'];

@Component({
  selector: 'who-floating-button-settings',
  templateUrl: './floating-button-settings.component.html',
  styleUrls: ['./floating-button-settings.component.scss']
})
export class FloatingButtonSettingsComponent implements OnInit {

  @Input() buttonForm: FormGroup;
  @Input() fields: any[];
  @Input() channels: Channel[];

  get scalarFields(): any[] {
    return this.fields.filter(x => x.type.kind === 'SCALAR' && !DISABLED_FIELDS.includes(x.name));
  }

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buttonForm.get('notify').valueChanges.subscribe(value => {
      if (value) {
        this.buttonForm.get('notificationChannel').setValidators(Validators.required);
        this.buttonForm.get('notificationMessage').setValidators(Validators.required);
      } else {
        this.buttonForm.get('notificationChannel').clearValidators();
        this.buttonForm.get('notificationMessage').clearValidators();
      }
      this.buttonForm.get('notificationChannel').updateValueAndValidity();
      this.buttonForm.get('notificationMessage').updateValueAndValidity();
    });

    this.buttonForm.get('publish').valueChanges.subscribe(value => {
      if (value) {
        this.buttonForm.get('publicationChannel').setValidators(Validators.required);
      } else {
        this.buttonForm.get('publicationChannel').clearValidators();
      }
      this.buttonForm.get('publicationChannel').updateValueAndValidity();
    });

    this.buttonForm.get('show').valueChanges.subscribe(value => {
      if (!value) {
        this.deleteInvalidModifications();
        this.buttonForm.controls.notify.setValue(false);
        this.buttonForm.controls.publish.setValue(false);
      }
    });
    this.buttonForm.get('modifySelectedRows').valueChanges.subscribe(value => {
      if (!value) {
        this.deleteInvalidModifications();
      }
    });
  }

  compareFields(field1: any, field2: any): boolean {
    if (field2) {
      return field1.name === field2.name;
    } else {
      return false;
    }
  }

  get modificationsArray(): FormArray {
    return this.buttonForm.get('modifications') as FormArray;
  }

  onDeleteModification(index: number): void {
    this.modificationsArray.removeAt(index);
  }

  onAddModification(): void {
    this.modificationsArray.push(this.formBuilder.group({
      field: ['', Validators.required],
      value: ['', Validators.required]
    }));
  }

  private deleteInvalidModifications(): void {
    const modifications = this.buttonForm.get('modifications') as FormArray;
    for (let i = 0; i < modifications.value.length; i ++) {
      const modification = modifications.at(i);
      if (modification.invalid) {
        modifications.removeAt(i);
        i--;
      }
    }
  }
}
