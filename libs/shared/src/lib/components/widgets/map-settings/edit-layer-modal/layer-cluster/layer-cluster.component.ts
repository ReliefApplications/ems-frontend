import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { INLINE_EDITOR_CONFIG } from '../../../../../const/tinymce.const';
import {
  PopupElement,
  PopupElementType,
} from '../../../../../models/layer.model';
import { EditorService } from '../../../../../services/editor/editor.service';
import { createPopupElementForm } from '../../map-forms';

/** Layer cluster settings */
@Component({
  selector: 'shared-layer-cluster',
  templateUrl: './layer-cluster.component.html',
  styleUrls: ['./layer-cluster.component.scss'],
})
export class LayerClusterComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  public expansivePanels = ['fields', 'label', 'popups'];
  public editorConfig = INLINE_EDITOR_CONFIG;

  /** @returns popup info as form group */
  get popupInfo(): FormGroup {
    return this.formGroup.get('popupInfo') as FormGroup;
  }

  /** @returns popup elements as form array */
  get popupElements(): FormArray {
    return this.popupInfo.get('popupElements') as FormArray;
  }

  /**
   * Layer cluster component.
   *
   * @param editorService Shared tinymce editor service
   */
  constructor(private editorService: EditorService) {}

  ngOnInit(): void {
    this.editorService.addCalcAndKeysAutoCompleter(this.editorConfig, [
      {
        value: `{cluster_count}`,
        text: `{cluster_count}`,
      },
    ]);
  }

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
