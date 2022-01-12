import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRecordModalComponent } from './record-modal.component';

describe('SafeRecordModalComponent', () => {
  let component: SafeRecordModalComponent;
  let fixture: ComponentFixture<SafeRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeRecordModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
