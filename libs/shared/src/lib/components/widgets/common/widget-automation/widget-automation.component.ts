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
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

/**
 * Widget automation edition.
 */
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
    DragDropModule,
  ],
  templateUrl: './widget-automation.component.html',
  styleUrls: ['./widget-automation.component.scss'],
})
export class WidgetAutomationComponent extends UnsubscribeComponent {
  /** Widget automation rule form group */
  public formGroup!: ReturnType<typeof createAutomationForm>;

  /** @returns list of rule components as form array */
  get components() {
    return this.formGroup.controls.components;
  }

  /**
   * Widget automation edition.
   *
   * @param data dialog data, automation rule ( empty if new )
   * @param dialog Angular dialog
   */
  constructor(@Inject(DIALOG_DATA) public data: any, private dialog: Dialog) {
    super();
    if (data) {
      this.formGroup = createAutomationForm(data);
    } else {
      this.formGroup = createAutomationForm();
    }
  }

  /**
   * Add a new component.
   */
  public async onAddComponent(): Promise<void> {
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

  /**
   * Edit a component
   * Display a dialog
   *
   * @param index index of component to edit
   */
  public async onEditComponent(index: number) {
    const { EditAutomationComponentComponent } = await import(
      './edit-automation-component/edit-automation-component.component'
    );
    const dialogRef = this.dialog.open(EditAutomationComponentComponent, {
      data: this.components.at(index).value,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.components.removeAt(index);
        this.components.insert(
          index,
          createAutomationComponentForm(value) as any
        );
      }
    });
  }

  /**
   * Reorders button actions.
   *
   * @param event event
   */
  onDrop(event: CdkDragDrop<(typeof this.components.controls)[]>) {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(
      this.components.controls,
      event.previousIndex,
      event.currentIndex
    );
  }

  /**
   * Delete component at index
   *
   * @param index index of component to delete
   */
  public onDeleteComponent(index: number) {
    this.components.removeAt(index);
  }
}
