import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IconName,
  icon as iconCreator,
} from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TooltipModule,
  getIconDefinition,
} from '@oort-front/ui';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { Fields } from '../../../../../../models/layer.model';
import { SanitizeHTMLModule } from '../../../../../../pipes/sanitize-html/sanitize-html.module';
import { GeometryType } from '../../../../../ui/map/interfaces/layer-settings.type';
import { UnsubscribeComponent } from '../../../../../utils/unsubscribe/unsubscribe.component';
import { createClassBreakInfoForm } from '../../../map-forms';
import { SimpleRendererComponent } from '../simple-renderer/simple-renderer.component';

/**
 * Class break renderer layer settings.
 */
@Component({
  selector: 'shared-class-break-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimpleRendererComponent,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
    IconModule,
    TranslateModule,
    TooltipModule,
    SanitizeHTMLModule,
  ],
  templateUrl: './class-break-renderer.component.html',
  styleUrls: ['./class-break-renderer.component.scss'],
})
export class ClassBreakRendererComponent
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
  /** Svg icons, one for each class break value info */
  public svgIcons: { [key: string]: string } = {};
  /** Currently opened class break vale */
  public openedIndex = -1;

  /** @returns get class break infos settings as form array */
  get classBreakInfos(): FormArray {
    return this.formGroup.get('classBreakInfos') as FormArray;
  }

  ngOnInit(): void {
    this.fields$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.scalarFields.next(
        value.filter((field) =>
          ['string', 'datetime', 'number', 'int', 'float'].includes(
            field.type.toLowerCase()
          )
        )
      );
    });
    this.createIconsSvgs();
    this.classBreakInfos.valueChanges
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
    (this.classBreakInfos.value ?? []).forEach((value: any, index: number) => {
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
    this.classBreakInfos.push(
      createClassBreakInfoForm(this.geometryType, this.classBreakInfos.length)
    );
    this.openedIndex = this.classBreakInfos.length - 1;
  }

  /**
   * Remove info form group
   *
   * @param index index of form group to remove
   */
  onRemoveInfo(index: number): void {
    this.classBreakInfos.removeAt(index);
    if (index === this.openedIndex) {
      this.openedIndex = -1;
    }
    if (index === 0) {
      this.classBreakInfos
        .at(index)
        .get('maxValue')
        ?.removeValidators(Validators.required);
    }
  }
}
