import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Output } from '@angular/core';
import { contentType, Content } from './layer-popup.interface';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';

/**
 * Map layer popup settings component.
 */
@Component({
  selector: 'safe-layer-popup',
  templateUrl: './layer-popup.component.html',
  styleUrls: ['./layer-popup.component.scss'],
})
export class LayerPopupComponent {
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();
  private list: Content[] = [
    {
      type: 'field',
      content: {
        title: 'super',
        description: 'text',
      },
    },
    {
      type: 'text',
      content: {
        title: 'featureclass',
      },
    },
  ];

  public formGroup!: UntypedFormGroup;

  /** @returns content as form array */
  get contentArray(): UntypedFormArray {
    return this.formGroup.get('content') as UntypedFormArray;
  }

  /**
   * Creates an instance of LayerPopupComponent.
   *
   * @param formBuilder Angular form builder
   */
  constructor(private formBuilder: UntypedFormBuilder) {
    this.formGroup = this.formBuilder.group({
      content: this.formBuilder.array([]),
    });

    this.list.forEach((item: Content) => {
      this.contentArray.push(
        this.formBuilder.group({
          type: [item.type],
          title: [item.content.title],
          description: [item.type === 'field' ? item.content.description : ''],
        })
      );
    });
  }

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param event Event emitted when a layer is reordered
   */
  public onListDrop(event: CdkDragDrop<Content[]>) {
    moveItemInArray(
      this.contentArray.controls,
      event.previousIndex,
      event.currentIndex
    );
  }

  /**
   * Add a new content block text or field block)
   *
   * @param {contentType} type content type (text or field)
   */
  public onAdd(type: contentType): void {
    this.contentArray.push(
      this.formBuilder.group({
        type: [type],
        title: [type],
        description: [''],
      })
    );
  }

  /**
   * Remove content item from the array
   *
   * @param {number} index item index
   */
  public onRemove(index: number): void {
    this.contentArray.removeAt(index);
  }
}
