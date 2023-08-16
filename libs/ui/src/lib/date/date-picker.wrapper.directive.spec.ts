import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormWrapperModule } from '../form-wrapper/form-wrapper.module';
import { DateModule } from './date.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DateWrapperDirective } from './date-wrapper.directive';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../button/button.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

/**
 * Component for testing purposes
 */
@Component({
  standalone: true,
  template: ` <form [formGroup]="form">
    <div uiFormFieldDirective [uiDateWrapper]="calendar">
      <label>{{ 'common.input.dateRange' | translate }}</label>
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

describe('DateWrapperDirective', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      imports: [
        TestingComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.queryAll(
      By.directive(DateWrapperDirective)
    );
    expect(directive).not.toBeNull();
    expect(directive).toBeTruthy();
  });
});
