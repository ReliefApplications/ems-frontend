import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMAIL_EDITOR_CONFIG } from '../../../../../lib/const/tinymce.const';

/** Model for the data input */
interface DialogData {
  name?: string;
  type?: string;
  content?: any;
}

/** Component for editing a template */
@Component({
  selector: 'safe-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss'],
})
export class SafeEditTemplateComponent implements OnInit {
  // === REACTIVE FORM ===
  form: FormGroup = new FormGroup({});

  public isNew = true;

  /** tinymce editor */
  public editor: any = EMAIL_EDITOR_CONFIG;

  /**
   * Constructor of the component
   *
   * @param formBuilder The form builder service
   * @param dialogRef The material dialog reference service
   * @param data The input data of the component
   */
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeEditTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  /** Load the roles and build the form. */
  ngOnInit(): void {
    const { name, type, content } = this.data;
    if (name) this.isNew = false;

    // In the future, change this according to the type of template
    this.form = this.formBuilder.group({
      name: [name || '', Validators.required],
      type: [type || 'email', Validators.required],
      subject: [content?.subject || '', Validators.required],
      body: [content?.body || '', Validators.required],
    });
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
