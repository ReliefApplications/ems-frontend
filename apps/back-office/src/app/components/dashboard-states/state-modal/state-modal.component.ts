import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

/**
 * Interface of Dialog data.
 */
interface DialogData {
  name?: string;
  value?: any;
  id?: any;
}

/**
 * Dashboard state modal component to update/create.
 */
@Component({
  selector: 'app-state-modal',
  templateUrl: './state-modal.component.html',
  styleUrls: ['./state-modal.component.scss'],
})
export class StateModalComponent implements OnInit {
  /** Reactive Form */
  public form!: ReturnType<typeof this.createForm>;
  /** Update state */
  public update = false;

  /**
   * Dashboard states component.
   *
   * @param data This is the data that is passed to the modal when it is opened.
   * @param fb This is the service that will be used to build forms.
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    if (this.data?.id) {
      this.update = true;
    }
  }

  ngOnInit(): void {
    this.form = this.createForm();
    if (!this.update) {
      this.form.controls.name.addValidators(Validators.required);
    }
  }

  /**
   * Create the form group
   *
   * @returns Form group
   */
  private createForm() {
    return this.fb.group({
      name: this.fb.control(this.data?.name ?? ''),
      value: this.fb.control(this.data?.value ?? null),
    });
  }
}
