import {
  AfterViewInit,
  Component,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

/**
 * Fields dropdown component.
 */
@Component({
  selector: 'safe-field-dropdown',
  templateUrl: './field-dropdown.component.html',
  styleUrls: ['./field-dropdown.component.scss'],
})
export class SafeFieldDropdownComponent implements AfterViewInit {
  @Input() fieldControl!: UntypedFormControl;
  @Input() fields: any[] = [];
  @Input() label = '';
  @Input() nullable = false;
  @ViewChildren('field') fieldComponents!: QueryList<any>;

  ngAfterViewInit(): void {
    console.log(
      this.fieldComponents.map((field) => field.value),
      'ok'
    );
  }
}
