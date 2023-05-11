import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWrapperComponent } from './form-wrapper.component';

describe('FormWrapperComponent', () => {
  let component: FormWrapperComponent;
  let fixture: ComponentFixture<FormWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
