import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {
  PopupElement,
  PopupElementType,
} from '../../../../../models/layer.model';
import { createPopupElementForm } from '../../map-forms';
import { Fields } from '../../../../../models/layer.model';
import { Observable, takeUntil } from 'rxjs';
import { INLINE_EDITOR_CONFIG } from '../../../../../const/tinymce.const';
import { EditorService } from '../../../../../services/editor/editor.service';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { DomPortal } from '@angular/cdk/portal';

/**
 * Map layer popup settings component.
 */
@Component({
  selector: 'shared-layer-popup',
  templateUrl: './layer-popup.component.html',
  styleUrls: ['./layer-popup.component.scss'],
})
export class LayerPopupComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Map dom portal */
  @Input() mapPortal?: DomPortal;
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** Keys for editor */
  public keys: { text: string; value: string }[] = [];
  /** Editor configuration */
  public editorConfig = INLINE_EDITOR_CONFIG;

  /** @returns popup elements as form array */
  get popupElements(): FormArray {
    return this.formGroup.get('popupElements') as FormArray;
  }

  /**
   * Creates an instance of LayerPopupComponent.
   *
   * @param editorService Shared tinymce editor service.
   */
  constructor(private editorService: EditorService) {
    super();
  }

  ngOnInit(): void {
    // Listen to fields changes
    this.fields$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.keys = value.map((field) => ({
        text: `{{${field.name}}}`,
        value: `{{${field.name}}}`,
      }));
      this.editorService.addCalcAndKeysAutoCompleter(
        this.editorConfig,
        this.keys
      );
    });
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
