import { Component, Input, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { TabsComponent } from '@oort-front/ui';
import { createTabFormGroup } from '../tabs-settings.form';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

/**
 * Main tab of tabs widget edition.
 */
@Component({
  selector: 'shared-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent {
  @Input() formGroup!: FormGroup;

  @ViewChild(TabsComponent, { static: false }) tabGroup!: TabsComponent;

  /** @returns widget tabs as form array */
  get tabs(): FormArray {
    return this.formGroup.get('tabs') as FormArray;
  }

  /**
   * Add a new tab
   *
   * @param event mouse event
   */
  onAddTab(event: MouseEvent): void {
    this.tabs.push(
      createTabFormGroup({
        label: 'New tab',
      })
    );
    event.stopPropagation();
  }

  /**
   * Delete a tab
   *
   * @param index index of tab to delete
   */
  onDeleteTab(index: number): void {
    this.tabs.removeAt(index);
    if (this.tabs.length > 0) {
      this.tabGroup.selectedIndex = 0;
    }
  }

  /**
   * Reorder tabs
   *
   * @param event drag & drop event
   */
  onReorder(event: CdkDragDrop<string[]>): void {
    const previous = event.previousIndex;
    const current = event.currentIndex;
    if (previous === current) {
      return;
    }
    const previousControl = this.tabs.at(previous);
    this.tabs.removeAt(previous);
    this.tabs.insert(current, previousControl);
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
  }
}
