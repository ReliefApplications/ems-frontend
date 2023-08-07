import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormWrapperModule } from '../form-wrapper/form-wrapper.module';
import { DateModule } from './date.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { DatePickerDirective } from './date-picker.directive';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { By } from '@angular/platform-browser';

/**
 * Component for testing purposes
 */
@Component({
  standalone: true,
  template: ` <form [formGroup]="form">
    <div uiFormFieldDirective>
      <label>{{ 'common.input.dateRange' | translate }}</label>
      <div [formGroup]="form">
        <input
          [uiDatePicker]
          formControlName="startDate"
          [label]="'kendo.datepicker.startLabel' | translate"
        />
        <input
          [uiDatePicker]
          formControlName="endDate"
          [label]="'kendo.datepicker.endLabel' | translate"
        />
        <ui-date-range #calendar> </ui-date-range>
      </div>
    </div>
  </form>`,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    ReactiveFormsModule,
    TranslateModule,
    DateModule,
  ],
})
class TestingComponent {
  form = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });
}

describe('DatePickerDirective', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      imports: [
        TestingComponent,
        TranslateTestingModule.withTranslations('en', {
          common: {
            input: { dateRange: 'Date Range' },
          },
          kendo: {
            datepicker: {
              startLabel: 'Start Date',
              endLabel: 'End Date',
            },
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(
      By.directive(DatePickerDirective)
    );
    expect(directive).not.toBeNull();
    expect(directive).toBeTruthy();
  });
});
