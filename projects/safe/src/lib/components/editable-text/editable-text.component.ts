import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Component to editable texts: display the text,
 * when hovering the text shows a grey background and
 * clicking on it creates a form control that allows edit the text.
 */
@Component({
  selector: 'safe-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss'],
})
export class SafeEditableTextComponent implements OnInit {
  @Input() text = '';
  @Input() canEdit = true;

  @Output() newText = new EventEmitter<string>();
  @Output() formActiveEvent = new EventEmitter<boolean>();

  public formActive = false;
  public textForm: FormGroup = new FormGroup({
    text: new FormControl('', Validators.required),
  });

  /**
   * Sets the value of the textForm with the value received from the parent component
   */
  ngOnInit(): void {
    this.textForm.controls.text.setValue(this.text);
  }

  /**
   * Toggle visibility of form.
   */
  toggleFormActive(): void {
    if (this.canEdit) {
      this.formActive = !this.formActive;
      this.formActiveEvent.next(this.formActive);
    }
  }

  /**
   * Apply the selected action:
   * if click on check mark: close form and update the text
   * if click on close: close form and previous value is applied
   *
   * @param {boolean} update update text action?
   */
  applyAction(update: boolean): void {
    if (update) {
      this.newText.next(this.textForm.controls.text.value);
    }
    this.toggleFormActive();
  }
}
