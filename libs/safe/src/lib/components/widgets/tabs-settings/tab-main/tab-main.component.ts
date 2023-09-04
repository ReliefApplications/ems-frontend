import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { TabsComponent } from '@oort-front/ui';
import { BehaviorSubject } from 'rxjs';
import { createTabFormGroup } from '../tabs-settings.form';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

/**
 * Main tab of tabs widget edition.
 */
@Component({
  selector: 'safe-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  @ViewChild(TabsComponent, { static: false }) tabGroup!: TabsComponent;

  TAB_ID_NAME = 'tab-';
  tabIds$ = new BehaviorSubject<string[]>([]);

  /** @returns widget tabs as form array */
  get tabs(): FormArray {
    return this.formGroup.get('tabs') as FormArray;
  }

  ngOnInit(): void {
    this.recalculateUniqIdsForDragDrop();
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
    this.recalculateUniqIdsForDragDrop();
  }

  /**
   * Delete a tab
   *
   * @param index index of tab to delete
   */
  onDeleteTab(index: number): void {
    this.tabs.removeAt(index);
    this.recalculateUniqIdsForDragDrop();
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
    this.recalculateUniqIdsForDragDrop();
  }

  /**
   * Calculate unique ids for identification of cdk drop lists
   */
  private recalculateUniqIdsForDragDrop(): void {
    const uniqIds: string[] = [];
    const buttonLength = this.tabs.length;
    for (let i = 0; i < buttonLength; i++) {
      uniqIds.push(`${this.TAB_ID_NAME}${i}`);
    }
    this.tabIds$.next(uniqIds);
  }
}
