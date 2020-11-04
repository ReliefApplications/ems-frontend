import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnswerComponent } from './form-answer.component';

describe('FormAnswerComponent', () => {
  let component: FormAnswerComponent;
  let fixture: ComponentFixture<FormAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
