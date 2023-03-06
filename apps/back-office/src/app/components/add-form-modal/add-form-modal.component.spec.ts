import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormModalComponent } from './add-form-modal.component';

describe('AddFormModalComponent', () => {
  let component: AddFormModalComponent;
  let fixture: ComponentFixture<AddFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFormModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
