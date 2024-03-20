import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SimpleRendererComponent } from '../simple-renderer/simple-renderer.component';
import { createUniqueValueInfoForm } from '../../../map-forms';
import { Fields } from '../../../../../../models/layer.model';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TooltipModule,
  getIconDefinition,
} from '@oort-front/ui';
import { GeometryType } from '../../../../../ui/map/interfaces/layer-settings.type';
import { TranslateModule } from '@ngx-translate/core';
import {
  IconName,
  icon as iconCreator,
} from '@fortawesome/fontawesome-svg-core';
import { SanitizeHTMLModule } from '../../../../../../pipes/sanitize-html/sanitize-html.module';
import { UnsubscribeComponent } from '../../../../../utils/unsubscribe/unsubscribe.component';

/**
 * Unique value renderer layer settings.
 */
@Component({
  selector: 'shared-unique-value-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimpleRendererComponent,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
    DragDropModule,
    IconModule,
    TranslateModule,
    TooltipModule,
    SanitizeHTMLModule,
  ],
  templateUrl: './unique-value-renderer.component.html',
  styleUrls: ['./unique-value-renderer.component.scss'],
})
export class UniqueValueRendererComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Type of layer geometry ( point / polygon ) */
  @Input() geometryType: GeometryType = 'Point';
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** All scalar fields */
  private scalarFields = new BehaviorSubject<Fields[]>([]);
  /** Scalar fields as observable */
  public scalarFields$ = this.scalarFields.asObservable();
  /** Svg icons, one for each unique value info */
  public svgIcons: { [key: string]: string } = {};
  /** Currently opened unique vale */
  public openedIndex = -1;

  /** @returns get unique infos settings as form array */
  get uniqueValueInfos(): FormArray {
    return this.formGroup.get('uniqueValueInfos') as FormArray;
  }

  ngOnInit(): void {
    this.fields$.subscribe((value) => {
      this.scalarFields.next(
        value.filter((field) =>
          ['string', 'datetime', 'number'].includes(field.type.toLowerCase())
        )
      );
    });
    this.createIconsSvgs();
    this.uniqueValueInfos.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.createIconsSvgs();
      });
  }

  /**
   * Create related svg icons for the given icon list
   */
  private createIconsSvgs() {
    this.svgIcons = {};
    (this.uniqueValueInfos.value ?? []).forEach((value: any, index: number) => {
      const iconDef = getIconDefinition(value.symbol.style as IconName);
      const i = iconCreator(iconDef, {
        styles: {
          height: '1rem',
          width: '1rem',
          color: value.symbol.color,
        },
      });
      this.svgIcons[index] = i.html[0];
    });
  }

  /** Add new info form group */
  onAddInfo(): void {
    this.uniqueValueInfos.push(createUniqueValueInfoForm(this.geometryType));
    this.openedIndex = this.uniqueValueInfos.length - 1;
  }

  /**
   * Remove info form group
   *
   * @param index index of form group to remove
   */
  onRemoveInfo(index: number): void {
    this.uniqueValueInfos.removeAt(index);
    if (index === this.openedIndex) {
      this.openedIndex = -1;
    }
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
