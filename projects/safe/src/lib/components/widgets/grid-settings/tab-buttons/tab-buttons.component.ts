import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { createButtonFormGroup } from '../grid-settings.forms';
import { Form } from '../../../../models/form.model';
import { Channel } from '../../../../models/channel.model';
import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatTabGroup } from '@angular/material/tabs';
import { BehaviorSubject } from 'rxjs';

/**
 * Buttons tab of grid widget configuration modal.
 */
@Component({
  selector: 'safe-tab-buttons',
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

  @ViewChild('tabGroup', { static: false }) childTabGroup!: MatTabGroup;

  CHILD_ID_NAME = 'menu-name';
  childMenuIds$ = new BehaviorSubject<string[]>([]);
  menus: number[] = [];

  ngOnInit(): void {
    const floatingButtons = this.formGroup?.get(
      'floatingButtons'
    ) as UntypedFormArray;
    this.menus = [...Array(floatingButtons.length).keys()];
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
    this.menus.push(this.menus.length + 1);
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
    this.menus.splice(index, 1);
    this.recalculateUniqIdsForDragDrop();
  }

  /**
   *tgs
   *
   * @param index dfg
   * @returns rst
   */
  trackByIndex(index: number): number {
    return index;
  }

  /**
   * d
   *
   * @param event d
   */
  onDropTab(event: CdkDragDrop<string[]>): void {
    const previousIndex = parseInt(
      event.previousContainer.id.replace(this.CHILD_ID_NAME, ''),
      10
    );
    const newIndex = parseInt(
      event.container.id.replace(this.CHILD_ID_NAME, ''),
      10
    );
    moveItemInArray(this.menus, previousIndex, newIndex);
    this.showDragWrapper(event);
  }

  /**
   * c
   *
   * @param event d
   */
  onDragEntered(event: CdkDragEnter): void {
    this.hideDragWrapper(event);
  }

  /**
   * d
   *
   * @param event d
   */
  onDragExited(event: CdkDragExit): void {
    this.showDragWrapper(event);
  }

  /**
   * d
   *
   * @param event d
   */
  private showDragWrapper(event: CdkDragExit | CdkDragDrop<string[]>): void {
    const element = this.getDragWrappedElement(event);
    if (element) {
      element.classList.remove('d-none');
    }
  }

  /**
   * d
   *
   * @param event d
   */
  private hideDragWrapper(event: CdkDragEnter): void {
    const element = this.getDragWrappedElement(event);
    if (element) {
      element.classList.add('d-none');
    }
  }

  /**
   * berth
   *
   * @param event d
   * @returns dreg
   */
  private getDragWrappedElement(
    event: CdkDragEnter | CdkDragExit
  ): HTMLElement | null {
    return event.container.element.nativeElement.querySelector(`.drag-wrapper`);
  }

  /**
   * berth
   */
  private recalculateUniqIdsForDragDrop(): void {
    const uniqIds: string[] = [];
    this.menus.reduce((accumulator: string[], _, index) => {
      accumulator.push(`${this.CHILD_ID_NAME}${index}`);
      return accumulator;
    }, uniqIds);
    this.childMenuIds$.next(uniqIds);
    console.log('reordered ids: ', this.childMenuIds$);
  }
}
