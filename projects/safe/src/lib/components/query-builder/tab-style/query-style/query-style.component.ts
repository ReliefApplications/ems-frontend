import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ComponentFactory,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-query-style',
  templateUrl: './query-style.component.html',
  styleUrls: ['./query-style.component.scss'],
})
export class SafeQueryStyleComponent implements OnInit {
  // @Input() factory?: ComponentFactory<any>;
  // @Input() availableFields: any[] = [];
  @Input() form!: FormGroup;
  // @Input() fields: any[] = [];
  @Input() scalarFields: any[] = [];

  @Output() closeEdition = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  /**
   * Toggles boolean controls.
   *
   * @param controlName name of form control.
   */
  onToggle(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(!control.value);
    }
  }
}
