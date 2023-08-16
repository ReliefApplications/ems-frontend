import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageDirective } from './error-message.directive';
import { ErrorMessageModule } from './error-message.module';
import { FormWrapperModule } from '../form-wrapper/form-wrapper.module';
import { By } from '@angular/platform-browser';
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
  template: ` <div
    [uiErrorMessage]="'components.errors.name' | translate"
    [uiErrorMessageIf]="name?.errors && name?.touched"
    uiFormFieldDirective
    class="flex-auto"
  >
    <label>
      {{ 'common.name' | translate }}
    </label>
    <input
      [formControl]="name"
      type="text"
      [placeholder]="'common.placeholder.name' | translate"
    />
  </div>`,
  imports: [
    FormWrapperModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ErrorMessageModule,
  ],
})
class TestingComponent {
  name = new FormControl('');
}

describe('ErrorMessageDirective', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();
    TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(
      By.directive(ErrorMessageDirective)
    );
    expect(directive).not.toBeNull();
    expect(directive).toBeTruthy();
  });
});
