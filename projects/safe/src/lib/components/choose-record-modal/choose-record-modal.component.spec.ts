import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeChooseRecordModalComponent } from './choose-record-modal.component';

describe('SafeChooseRecordModalComponent', () => {
  let component: SafeChooseRecordModalComponent;
  let fixture: ComponentFixture<SafeChooseRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeChooseRecordModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeChooseRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
