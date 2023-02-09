import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { createButtonFormGroup } from '../grid-settings.forms';
import { Form } from '../../../../models/form.model';
import { Channel } from '../../../../models/channel.model';
import { CdkDragDrop, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
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
    console.log(event);
    const previous = parseInt(
      event.previousContainer.id.replace(this.TAB_ID_NAME, ''),
      10
    );
    const current = parseInt(
      event.container.id.replace(this.TAB_ID_NAME, ''),
      10
    );
    console.log(previous);
    console.log(current);
    if (previous === current) {
      return;
    }
    const previousControl = this.buttons.at(previous);
    const currentControl = this.buttons.at(current);
    this.buttons.setControl(current, previousControl);
    this.buttons.setControl(previous, currentControl);
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
    const buttonLength = this.buttons.length;
    for (let i = 0; i < buttonLength; i++) {
      uniqIds.push(`${this.TAB_ID_NAME}${i}`);
    }
    this.tabIds$.next(uniqIds);
  }
}
