import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { createButtonFormGroup } from '../grid-settings.forms';
import { Form } from '../../../../models/form.model';
import { Channel } from '../../../../models/channel.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TabsComponent } from '@oort-front/ui';

/**
 * Buttons tab of grid widget configuration modal.
 */
@Component({
  selector: 'shared-tab-buttons',
  templateUrl: './tab-buttons.component.html',
  styleUrls: ['./tab-buttons.component.scss'],
})
export class TabButtonsComponent {
  /** Form group */
  @Input() formGroup!: UntypedFormGroup;
  /** List of fields */
  @Input() fields: any[] = [];
  /** List of forms */
  @Input() relatedForms: Form[] = [];
  /** List of channels */
  @Input() channels?: Channel[];
  /** List of templates */
  @Input() templates: any[] = [];
  /** List of distribution lists */
  @Input() distributionLists: any[] = [];
  /** Emits when the select channel is opened for the first time */
  @Output() loadChannels = new EventEmitter<void>();

  /** Tabs component */
  @ViewChild(TabsComponent, { static: false }) tabGroup!: TabsComponent;

  /** @returns List of the floating buttons */
  get buttons(): UntypedFormArray {
    return (
      (this.formGroup?.controls.floatingButtons as UntypedFormArray) || null
    );
  }

  /**
   * Adds a floating button configuration.
   *
   * @param event sf
   */
  public addButton(event: MouseEvent): void {
    const floatingButtons = this.formGroup?.get(
      'floatingButtons'
    ) as UntypedFormArray;
    floatingButtons.push(createButtonFormGroup({ show: true }));
    event.stopPropagation();
  }

  /**
   * Deletes a floating button configuration.
   *
   * @param index index of button to remove
   */
  public deleteButton(index: number): void {
    const floatingButtons = this.formGroup?.get(
      'floatingButtons'
    ) as UntypedFormArray;
    floatingButtons.removeAt(index);
  }

  /**
   * Handle reorder event
   *
   * @param event cdk drag and drop event.
   */
  onReorder(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.buttons.controls,
      event.previousIndex,
      event.currentIndex
    );
    const previousTabIndex = this.tabGroup.selectedIndex || 0;
    let selectedIndex = 0;
    if (event.previousIndex === previousTabIndex) {
      selectedIndex = event.currentIndex;
    } else {
      if (
        event.previousIndex > event.currentIndex &&
        event.currentIndex <= previousTabIndex
      ) {
        selectedIndex = previousTabIndex + 1;
      }
      if (
        event.previousIndex < event.currentIndex &&
        event.currentIndex >= previousTabIndex
      ) {
        selectedIndex = previousTabIndex - 1;
      }
    }
    this.tabGroup.tabs.get(selectedIndex)?.openTab.emit();
  }
}
