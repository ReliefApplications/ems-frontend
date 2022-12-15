import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeEditorService } from '../../../../services/editor/editor.service';
import { EMAIL_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { SafePlaceholderPipe } from '../../../../pipes/placeholder/placeholder.pipe';
import get from 'lodash/get';

/** Model for the data input */
interface DialogData {
  name?: string;
  type?: string;
  content?: any;
}

/** Component for editing a template */
@Component({
  selector: 'safe-edit-template',
  templateUrl: './edit-template-modal.component.html',
  styleUrls: ['./edit-template-modal.component.scss'],
})
export class EditTemplateModalComponent implements OnInit {
  // === REACTIVE FORM ===
  form: FormGroup = new FormGroup({});

  /** tinymce editor */
  public editor: any = EMAIL_EDITOR_CONFIG;

  /**
   * Component for editing a template
   *
   * @param formBuilder Angular form builder service
   * @param dialogRef Material dialog ref of the component
   * @param data Data input of the modal
   * @param editorService Editor service used to get main URL and current language
   * @param placeholder Placeholder pipe to format the placeholders
   */
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditTemplateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private editorService: SafeEditorService,
    private placeholder: SafePlaceholderPipe
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  /** Build the form. */
  ngOnInit(): void {
    // In the future, change this according to the type of template
    this.form = this.formBuilder.group({
      name: [get(this.data, 'name', null), Validators.required],
      type: [get(this.data, 'type', 'email'), Validators.required],
      subject: [get(this.data, 'content.subject', null), Validators.required],
      body: [
        this.placeholder.transform(get(this.data, 'content.body', '')),
        Validators.required,
      ],
    });

    // TODO: Editor loses focus when the parsed value is set
    this.form.get('body')?.valueChanges.subscribe((value) => {
      const parsed = this.placeholder.transform(value);
      if (parsed !== value) {
        this.form.get('body')?.setValue(parsed);
      }
    });
  }
}
