import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, DialogModule, FormWrapperModule } from '@oort-front/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { createAutomationForm } from '../../../../forms/automation.forms';

@Component({
  selector: 'shared-widget-automation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    FormWrapperModule,
  ],
  templateUrl: './widget-automation.component.html',
  styleUrls: ['./widget-automation.component.scss'],
})
export class WidgetAutomationComponent extends UnsubscribeComponent {
  public formGroup!: ReturnType<typeof createAutomationForm>;

  constructor(@Inject(DIALOG_DATA) public data: any) {
    super();
    if (data) {
      this.formGroup = createAutomationForm(data);
    } else {
      this.formGroup = createAutomationForm();
    }
  }

  public addComponent() {
    console.log('add component');
  }
}
