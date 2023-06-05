import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SimpleRendererComponent } from '../simple-renderer/simple-renderer.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeButtonModule } from '../../../../../ui/button/button.module';
import { createUniqueValueInfoForm } from '../../../map-forms';
import { SafeIconDisplayModule } from '../../../../../../pipes/icon-display/icon-display.module';
import { Fields } from '../../layer-fields/layer-fields.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BehaviorSubject, Observable } from 'rxjs';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SafeIconModule } from '../../../../../ui/icon/icon.module';

/**
 *
 */
@Component({
  selector: 'safe-unique-value-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimpleRendererComponent,
    MatInputModule,
    MatFormFieldModule,
    SafeButtonModule,
    SafeIconDisplayModule,
    MatSelectModule,
    DragDropModule,
    SafeIconModule,
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

  /**
   *
   */
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

  /**
   *
   */
  onAddInfo(): void {
    this.uniqueValueInfos.push(createUniqueValueInfoForm());
    this.openedIndex = this.uniqueValueInfos.length - 1;
  }

  /**
   *
   * @param index
   */
  onRemoveInfo(index: number): void {
    if (index === this.openedIndex) {
      this.openedIndex = -1;
    }
    this.uniqueValueInfos.removeAt(index);
  }

  /**
   *
   * @param event
   */
  onDrop(event: any): void {
    this.openedIndex = -1;
    const uniqueValueInfos = this.uniqueValueInfos.value;
    moveItemInArray(uniqueValueInfos, event.previousIndex, event.currentIndex);
    this.uniqueValueInfos.setValue(uniqueValueInfos);
  }
}
