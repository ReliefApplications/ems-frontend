import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {
  PopupElement,
  PopupElementType,
} from '../../../../../models/layer.model';
import { SafeMapLayersService } from '../../../../../services/map/map-layers.service';
import { createPopupElementForm } from '../../map-forms';
import { Fields } from '../layer-fields/layer-fields.component';
import { Observable } from 'rxjs';

/**
 * Map layer popup settings component.
 */
@Component({
  selector: 'safe-layer-popup',
  templateUrl: './layer-popup.component.html',
  styleUrls: ['./layer-popup.component.scss'],
})
export class LayerPopupComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields$!: Observable<Fields[]>;

  /** @returns popup elements as form array */
  get popupElements(): FormArray {
    return this.formGroup.get('popupElements') as FormArray;
  }

  /**
   * Creates an instance of LayerPopupComponent.
   *
   * @param mapLayersService Shared map layer Service.
   */
  constructor(private mapLayersService: SafeMapLayersService) {}

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param event Event emitted when a layer is reordered
   */
  public onListDrop(event: CdkDragDrop<PopupElement[]>) {
    moveItemInArray(
      this.popupElements.controls,
      event.previousIndex,
      event.currentIndex
    );
  }

  /**
   * Add a new content block text or field block)
   *
   * @param type content type (text or field)
   */
  public onAddElement(type: PopupElementType): void {
    this.popupElements.push(createPopupElementForm({ type }));
  }

  /**
   * Remove content item from the array
   *
   * @param {number} index item index
   */
  public onRemoveElement(index: number): void {
    this.popupElements.removeAt(index);
  }
}
