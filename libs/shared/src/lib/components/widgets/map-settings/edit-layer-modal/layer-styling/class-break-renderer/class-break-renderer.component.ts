import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  IconName,
  icon as iconCreator,
} from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  ErrorMessageModule,
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
 * Updates form validation checking if set values order set is correct
 * - ASC from top to bottom
 *
 * @returns validation success or fail for incorrect values order set
 */
function isMaxValueOrderValid(): any {
  return (group: FormGroup): ValidationErrors | null => {
    let isValid = true;
    if (group.get('minValue')?.dirty && group.get('minValue')?.value) {
      for (
        let index = 0;
        index < (group.get('classBreakInfos') as FormArray).length;
        index++
      ) {
        const maxValue = (group.get('classBreakInfos') as FormArray).at(index)
          .value.maxValue;
        if (group.get('minValue')?.value > maxValue) {
          isValid = false;
          break;
        }
      }
    }
    if (!isValid) {
      return { incorrectMaxValueOrder: true };
    }
    return null;
  };
}

/**
 * Updates form validation checking if there given class break items value are in order:
 * - ASC from top to bottom
 *
 * Updates form validation checking if there are repeated set values
 *
 * @returns validation success or fail for same values set
 */
function classBreakValidators(): any {
  return (formArray: FormArray): ValidationErrors | null => {
    let invalidClassBreakIndex = -1;
    let repeatedValues = false;
    let invalidClassBreak = false;
    if (formArray.length >= 2) {
      for (let index = 1; index < formArray.length; index++) {
        formArray.at(index).setErrors(null);
        const maxValue = formArray.at(index).value.maxValue;
        const maxValues = formArray.controls
          .filter((_, i) => i !== index)
          .map((control) => control.value.maxValue);
        if (
          formArray.at(index).get('maxValue')?.dirty &&
          (maxValue < formArray.at(index - 1).value.maxValue ||
            maxValues.includes(maxValue)) &&
          invalidClassBreakIndex === -1
        ) {
          if (maxValue < formArray.at(index - 1).value.maxValue) {
            invalidClassBreak = true;
          }
          if (maxValues.includes(maxValue)) {
            repeatedValues = true;
          }
          invalidClassBreakIndex = index;
        }
      }
    }
    if (invalidClassBreakIndex !== -1) {
      if (invalidClassBreak) {
        formArray
          .at(invalidClassBreakIndex)
          .setErrors({ invalidClassBreakOrder: true });
      }
      if (repeatedValues) {
        formArray
          .at(invalidClassBreakIndex)
          .setErrors({ repeatedValues: true });
      }
    }
    return null;
  };
}

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
    ErrorMessageModule,
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
    this.formGroup.addValidators(isMaxValueOrderValid());
    this.classBreakInfos.addValidators(classBreakValidators());
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
    /** First class break item max value is not mandatory as it depends on minValue, not other class break items in the list for range set */
    if (index === 0) {
      this.classBreakInfos
        .at(index)
        .get('maxValue')
        ?.removeValidators(Validators.required);
    }
  }
}
