import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeConfirmModalComponent } from './confirm-modal.component';

describe('SafeConfirmModalComponent', () => {
  let component: SafeConfirmModalComponent;
  let fixture: ComponentFixture<SafeConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeConfirmModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
