import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormWrapperDirective } from './form-wrapper.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/**
 * Component for testing purposes
 */
@Component({
  template: `<div uiFormFieldDirective>
    <label>Phone Number</label>
    <input
      type="text"
      name="account-number"
      id="account-number"
      placeholder="000-00-0000"
    />
    <ui-spinner [size]="'medium'" uiSuffix></ui-spinner>
    <ui-icon icon="search" uiPrefix></ui-icon>
  </div>`,
})
class TestingComponent {}

describe('FormWrapperDirective', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  let component: TestingComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [FormWrapperDirective, TestingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).createComponent(TestingComponent);

    fixture.detectChanges(); // initial binding

    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
