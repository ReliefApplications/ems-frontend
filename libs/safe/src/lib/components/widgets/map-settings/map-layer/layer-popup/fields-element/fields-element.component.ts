import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeDividerModule } from '../../../../../ui/divider/divider.module';
import { SafeButtonModule } from '../../../../../ui/button/button.module';
import { popupElement } from '../layer-popup.interface';

/**
 * Popup fields element component.
 */
@Component({
  selector: 'safe-fields-element',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    SafeDividerModule,
    SafeButtonModule,
  ],
  templateUrl: './fields-element.component.html',
  styleUrls: ['./fields-element.component.scss'],
})
export class FieldsElementComponent {
  public fields = [
    {
      name: 'field1',
    },
    {
      name: 'field2',
    },
    {
      name: 'field3',
    },
  ];

  @Input() formGroup!: FormGroup;

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param event Event emitted when a layer is reordered
   */
  public onListDrop(event: CdkDragDrop<popupElement[]>) {
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
  }

  /**
   * Remove field from the array
   *
   * @param {number} index item index
   */
  public onRemoveField(index: number): void {
    this.fields = this.fields.splice(index, 1);
  }
}
