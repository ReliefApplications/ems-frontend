import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordHistoryModalComponent } from './record-history-modal.component';

describe('HistoryModalComponent', () => {
  let component: RecordHistoryModalComponent;
  let fixture: ComponentFixture<RecordHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
