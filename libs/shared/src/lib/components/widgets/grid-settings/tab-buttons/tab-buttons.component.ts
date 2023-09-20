import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { createButtonFormGroup } from '../grid-settings.forms';
import { Form } from '../../../../models/form.model';
import { Channel } from '../../../../models/channel.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';
import { TabsComponent } from '@oort-front/ui';

/**
 * Buttons tab of grid widget configuration modal.
 */
@Component({
  selector: 'shared-tab-buttons',
  templateUrl: './tab-buttons.component.html',
  styleUrls: ['./tab-buttons.component.scss'],
})
export class TabButtonsComponent implements OnInit {
  @Input() formGroup!: UntypedFormGroup;
  @Input() fields: any[] = [];
  @Input() relatedForms: Form[] = [];
  @Input() channels: Channel[] = [];
  @Input() templates: any[] = [];
  @Input() distributionLists: any[] = [];

  @ViewChild(TabsComponent, { static: false }) tabGroup!: TabsComponent;

  TAB_ID_NAME = 'button-';
  tabIds$ = new BehaviorSubject<string[]>([]);

  ngOnInit(): void {
    this.recalculateUniqIdsForDragDrop();
  }

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
    this.recalculateUniqIdsForDragDrop();
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
    this.recalculateUniqIdsForDragDrop();
  }

  /**
   * Handle reorder event
   *
   * @param event cdk drag and drop event.
   */
  onReorder(event: CdkDragDrop<string[]>): void {
    const previous = parseInt(
      event.previousContainer.id.replace(this.TAB_ID_NAME, ''),
      10
    );
    const current = parseInt(
      event.container.id.replace(this.TAB_ID_NAME, ''),
      10
    );
    if (previous === current) {
      return;
    }
    const previousControl = this.buttons.at(previous);
    this.buttons.removeAt(previous);
    this.buttons.insert(current, previousControl);
    const previousTabIndex = this.tabGroup.selectedIndex || 0;
    let selectedIndex = 0;
    if (previous === previousTabIndex) {
      selectedIndex = current;
    } else {
      if (previous > current && current <= previousTabIndex) {
        selectedIndex = previousTabIndex + 1;
      }
      if (previous < current && current >= previousTabIndex) {
        selectedIndex = previousTabIndex - 1;
      }
    }
    this.tabGroup.tabs.get(selectedIndex)?.openTab.emit();
    this.recalculateUniqIdsForDragDrop();
  }

  /**
   * Calculate unique ids for identification of cdk drop lists
   */
  private recalculateUniqIdsForDragDrop(): void {
    const uniqIds: string[] = [];
    const buttonLength = this.buttons.length;
    for (let i = 0; i < buttonLength; i++) {
      uniqIds.push(`${this.TAB_ID_NAME}${i}`);
    }
    this.tabIds$.next(uniqIds);
  }
}
