import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

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
  // Full text to display
  @Input() text: string | undefined = '';
  @Input() canEdit = false;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onChange = new EventEmitter<string>();
  @Output() formActiveEvent = new EventEmitter<boolean>();
  public formControl!: FormControl;

  /**
   *  Component to editable texts: display the text,
   * when hovering the text shows a grey background and
   * clicking on it creates a form control that allows edit the text.
   *
   * @param fb Angular form builder
   */
  constructor(private fb: FormBuilder) {}

  /**
   * Sets the value of the textForm with the value received from the parent component
   */
  ngOnInit(): void {
    this.formControl = this.fb.control(
      { value: this.text, disabled: true },
      Validators.required
    );
    this.onChange.subscribe((value) => {
      if (!value) {
        this.formControl.setValue(this.text);
      }
      this.formControl.disable();
      this.formActiveEvent.next(this.formControl.enabled);
    });
  }

  /**
   * Toggle control disabled state.
   */
  toggleControlState(): void {
    if (this.canEdit) {
      if (this.formControl.enabled) {
        this.formControl.disable();
      } else {
        this.formControl.enable();
      }
      this.formActiveEvent.next(this.formControl.enabled);
    }
  }
}
