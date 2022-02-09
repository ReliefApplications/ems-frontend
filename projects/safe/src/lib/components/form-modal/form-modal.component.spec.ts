import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeFormModalComponent } from './form-modal.component';

describe('SafeFormModalComponent', () => {
  let component: SafeFormModalComponent;
  let fixture: ComponentFixture<SafeFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeFormModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
