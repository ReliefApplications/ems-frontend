import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  TooltipModule,
} from '@oort-front/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import {
  createAutomationComponentForm,
  createAutomationForm,
} from '../../../../forms/automation.forms';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'shared-widget-automation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TooltipModule,
  ],
  templateUrl: './widget-automation.component.html',
  styleUrls: ['./widget-automation.component.scss'],
})
export class WidgetAutomationComponent extends UnsubscribeComponent {
  public formGroup!: ReturnType<typeof createAutomationForm>;

  get components() {
    return this.formGroup.controls.components;
  }

  constructor(@Inject(DIALOG_DATA) public data: any, private dialog: Dialog) {
    super();
    if (data) {
      this.formGroup = createAutomationForm(data);
    } else {
      this.formGroup = createAutomationForm();
    }
  }

  public async onAddComponent(): Promise<void> {
    console.log('add component');
    const { AutomationComponentSelectorComponent } = await import(
      './automation-component-selector/automation-component-selector.component'
    );
    const dialogRef = this.dialog.open(AutomationComponentSelectorComponent);
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.components.push(createAutomationComponentForm(value));
      }
    });
  }

  public onEditComponent(index: number) {
    console.log('edit at index:', index);
  }

  public onDeleteComponent(index: number) {
    this.components.removeAt(index);
  }
}
