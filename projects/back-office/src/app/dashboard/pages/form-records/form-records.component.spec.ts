import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRecordsComponent } from './form-records.component';

describe('FormRecordsComponent', () => {
  let component: FormRecordsComponent;
  let fixture: ComponentFixture<FormRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
