import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocompleteDirective } from './autocomplete.directive';
import { Component, Renderer2 } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormWrapperModule } from '../form-wrapper/form-wrapper.module';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

/**
 * Mocked class as Renderer2 to use for directive build
 */
class mockRenderer2 {
  /**
   * addClass
   *
   * @param el element where to apply class
   * @param name class name
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  static addClass(el: any, name: string) {}
}
/**
 * Mocked component for deep testing of menu directive
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    AutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
  ],
  template: ` <form [formGroup]="form">
    <div uiFormFieldDirective>
      <label>Options</label>
      <input
        type="text"
        placeholder="Select an option"
        formControlName="formControl"
        [uiAutocomplete]="auto"
      />
      <ui-autocomplete #auto>
        <ui-option
          *ngFor="let option of options; let i = index"
          [value]="i"
          [label]="'option' + i"
        >
          Option {{ i }}
        </ui-option>
      </ui-autocomplete>
    </div>
  </form>`,
})
class TestingComponent {
  options = new Array(3);
  form = new FormGroup({
    formControl: new FormControl(''),
  });
}

describe('AutocompleteDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingComponent],
      providers: [{ provide: Renderer2, useClass: mockRenderer2 }],
    }).compileComponents();
    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(
      By.directive(AutocompleteDirective)
    );
    expect(directive).not.toBeNull();
    expect(directive).toBeTruthy();
  });
});
