import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferenceDataComponent } from './add-reference-data.component';

describe('AddReferenceDataComponent', () => {
  let component: AddReferenceDataComponent;
  let fixture: ComponentFixture<AddReferenceDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddReferenceDataComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReferenceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
