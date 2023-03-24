import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  Input,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 *
 */
@Component({
  selector: 'safe-series-settings',
  templateUrl: './series-settings.component.html',
  styleUrls: ['./series-settings.component.css'],
})
export class SafeSeriesSettingsComponent implements OnChanges, OnInit {
  @Input() formGroup!: UntypedFormGroup;
  /**
   *
   * @param fb
   */
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    console.log(this.formGroup);
  }

  /**
   *
   */
  testing() {}
}
