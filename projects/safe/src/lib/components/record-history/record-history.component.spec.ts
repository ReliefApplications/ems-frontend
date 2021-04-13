import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRecordHistoryComponent } from './record-history.component';

describe('SafeRecordHistoryComponent', () => {
  let component: SafeRecordHistoryComponent;
  let fixture: ComponentFixture<SafeRecordHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeRecordHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRecordHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
