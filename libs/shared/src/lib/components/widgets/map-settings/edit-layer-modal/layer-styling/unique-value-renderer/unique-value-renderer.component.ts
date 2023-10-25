import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SimpleRendererComponent } from '../simple-renderer/simple-renderer.component';
import { createUniqueValueInfoForm } from '../../../map-forms';
import { Fields } from '../../../../../../models/layer.model';
import { BehaviorSubject, Observable } from 'rxjs';
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
export class UniqueValueRendererComponent implements OnInit, OnChanges {
  @Input() geometryType: GeometryType = 'Point';
  @Input() formGroup!: FormGroup;
  @Input() fields$!: Observable<Fields[]>;
  private scalarFields = new BehaviorSubject<Fields[]>([]);
  public scalarFields$ = this.scalarFields.asObservable();
  public svgIcons: { [key: string]: string } = {};
  openedIndex = -1;

  /** @returns get unique infos settings as form array */
  get uniqueValueInfos(): FormArray {
    return this.formGroup.get('uniqueValueInfos') as FormArray;
  }

  ngOnInit(): void {
    this.fields$.subscribe((value) => {
      this.scalarFields.next(
        value.filter((field) => ['string'].includes(field.type.toLowerCase()))
      );
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['uniqueValueInfos']?.currentValue !=
      changes['uniqueValueInfos']?.previousValue
    ) {
      this.createIconsSvgs();
    }
  }

  /**
   * Create related svg icons for the given icon list
   */
  private createIconsSvgs() {
    this.svgIcons = {};
    (this.uniqueValueInfos.value ?? []).forEach((value: any) => {
      const iconDef = getIconDefinition(value.symbol.style as IconName);
      const i = iconCreator(iconDef, {
        styles: {
          color: value.symbol.color,
        },
      });
      this.svgIcons[value.symbol.style] = i.html[0];
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
