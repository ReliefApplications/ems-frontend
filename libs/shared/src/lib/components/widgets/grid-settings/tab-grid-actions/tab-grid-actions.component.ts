import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { createGridActionFormGroup } from '../grid-settings.forms';
import { Form } from '../../../../models/form.model';
import { Channel } from '../../../../models/channel.model';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  AlertModule,
  ButtonModule,
  IconModule,
  TabsComponent,
  TabsModule,
  TooltipModule,
} from '@oort-front/ui';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GridActionSettingsComponent } from '../grid-action-settings/grid-action-settings.component';

/**
 * Grid Actions configuration tab.
 */
@Component({
  standalone: true,
  selector: 'shared-tab-grid-actions',
  templateUrl: './tab-grid-actions.component.html',
  styleUrls: ['./tab-grid-actions.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    TabsModule,
    DragDropModule,
    GridActionSettingsComponent,
    ButtonModule,
    AlertModule,
    TooltipModule,
  ],
})
export class TabGridActionsComponent {
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

  /** @returns List of grid actions */
  get gridActions(): UntypedFormArray {
    return (
      (this.formGroup?.controls.floatingButtons as UntypedFormArray) || null
    );
  }

  /**
   * Adds a grid action configuration.
   *
   * @param event Mouse event
   */
  public addAction(event: MouseEvent): void {
    const gridActions = this.formGroup?.get(
      'floatingButtons'
    ) as UntypedFormArray;
    gridActions.push(createGridActionFormGroup({ show: true }));
    // Open new action
    this.tabGroup.selectedIndex = gridActions.length - 1;
    event.stopPropagation();
  }

  /**
   * Deletes a grid action configuration.
   *
   * @param index index of action to remove
   */
  public deleteAction(index: number): void {
    const gridActions = this.formGroup?.get(
      'floatingButtons'
    ) as UntypedFormArray;
    gridActions.removeAt(index);
    if (this.tabGroup.selectedIndex === index && gridActions.length > 0) {
      // Open previous action if possible, or first action
      this.tabGroup.selectedIndex = Math.max(
        0,
        this.tabGroup.selectedIndex - 1
      );
    }
  }

  /**
   * Handle reorder event
   *
   * @param event cdk drag and drop event.
   */
  onReorder(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.gridActions.controls,
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
