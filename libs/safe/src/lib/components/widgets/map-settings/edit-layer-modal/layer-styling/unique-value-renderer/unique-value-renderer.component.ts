import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SimpleRendererComponent } from '../simple-renderer/simple-renderer.component';
import { createUniqueValueInfoForm } from '../../../map-forms';
import { SafeIconDisplayModule } from '../../../../../../pipes/icon-display/icon-display.module';
import { Fields } from '../../layer-fields/layer-fields.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
} from '@oort-front/ui';

/**
 * Unique value renderer layer settings.
 */
@Component({
  selector: 'safe-unique-value-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimpleRendererComponent,
    ButtonModule,
    FormWrapperModule,
    SafeIconDisplayModule,
    SelectMenuModule,
    DragDropModule,
    IconModule,
  ],
  templateUrl: './unique-value-renderer.component.html',
  styleUrls: ['./unique-value-renderer.component.scss'],
})
export class UniqueValueRendererComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() fields$!: Observable<Fields[]>;
  private scalarFields = new BehaviorSubject<Fields[]>([]);
  public scalarFields$ = this.scalarFields.asObservable();

  openedIndex = -1;

  /** @returns get unique infos settings as form array */
  get uniqueValueInfos(): FormArray {
    return this.formGroup.get('uniqueValueInfos') as FormArray;
  }

  ngOnInit(): void {
    this.fields$.subscribe((value) => {
      this.scalarFields.next(
        value.filter((field) => ['String'].includes(field.type))
      );
    });
  }

  /** Add new info form group */
  onAddInfo(): void {
    this.uniqueValueInfos.push(createUniqueValueInfoForm());
    this.openedIndex = this.uniqueValueInfos.length - 1;
  }

  /**
   * Remove info form group
   *
   * @param index index of form group to remove
   */
  onRemoveInfo(index: number): void {
    if (index === this.openedIndex) {
      this.openedIndex = -1;
    }
    this.uniqueValueInfos.removeAt(index);
  }

  /**
   * Reorder info form groups
   *
   * @param event reorder event
   */
  onDrop(event: any): void {
    this.openedIndex = -1;
    const uniqueValueInfos = this.uniqueValueInfos.value;
    moveItemInArray(uniqueValueInfos, event.previousIndex, event.currentIndex);
    this.uniqueValueInfos.setValue(uniqueValueInfos);
  }
}
