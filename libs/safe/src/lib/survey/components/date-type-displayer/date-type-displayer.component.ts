import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionDateTypeDisplayerModel } from './date-type-displayer.model';
import { DomService } from '../../../services/dom/dom.service';
import { QuestionText } from '../../types';
import {
  DateInputFormat,
  createPickerInstance,
  getDateDisplay,
  setDateValue,
} from '../utils/create-picker-instance';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'safe-date-type-displayer',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class SafeDateTypeDisplayerComponent
  extends QuestionAngular<QuestionDateTypeDisplayerModel>
  implements OnInit, OnDestroy
{
  private instanceId = `survey-creator-date-picker${uuidv4()}`;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef,
    private domService: DomService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.model.obj.registerFunctionOnPropertyValueChanged(
      'inputType',
      this.updatePickerInstance.bind(this),
      // eslint-disable-next-line no-underscore-dangle
      this.model.obj.name // a unique key to distinguish multiple date properties
    );
    // Init
    this.updatePickerInstance();
  }

  /**
   * Update displayed picker instance type on inputType change in the survey creator property grid editor
   */
  updatePickerInstance() {
    let pickerDiv: HTMLDivElement | null = null;
    const previousDatePicker = this.document.getElementById(this.instanceId);
    if (previousDatePicker) {
      previousDatePicker.remove();
      this.instanceId = `survey-creator-date-picker${uuidv4()}`;
    }
    this.el.nativeElement.querySelector('.k-widget')?.remove(); // .k-widget class is shared by the 3 types of picker
    pickerDiv = this.renderer.createElement('div');
    this.renderer.setAttribute(pickerDiv, 'id', this.instanceId);
    const pickerInstance = createPickerInstance(
      this.model.obj.inputType as DateInputFormat,
      pickerDiv,
      this.domService
    );
    if (pickerInstance) {
      if (this.model.obj[this.model.obj.name as keyof QuestionText]) {
        pickerInstance.value = getDateDisplay(
          this.model.obj[this.model.name as keyof QuestionText],
          this.model.obj.inputType
        );
      }
      pickerInstance.registerOnChange((value: Date | null) => {
        if (value) {
          this.model.onChanged(setDateValue(value, this.model.obj.inputType));
        } else {
          this.model.onChanged(null);
        }
      });
    }
    this.renderer.appendChild(this.el.nativeElement, pickerDiv);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.model.obj.unRegisterFunctionOnPropertyValueChanged('inputType');
  }
}
