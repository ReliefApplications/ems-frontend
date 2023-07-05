import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { WidgetFormT, createWidgetForm } from './tabs-settings.form';

@Component({
  selector: 'safe-tabs-settings',
  templateUrl: './tabs-settings.component.html',
  styleUrls: ['./tabs-settings.component.scss'],
})
export class TabsSettingsComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public formGroup!: WidgetFormT;
  @Input() tile: any;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = createWidgetForm(this.fb, this.tile);
    this.change.emit(this.formGroup);
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.change.emit(this.formGroup));
  }
}
