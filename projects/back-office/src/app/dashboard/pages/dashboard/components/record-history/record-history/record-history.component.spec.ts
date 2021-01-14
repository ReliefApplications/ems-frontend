import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordHistoryComponent } from './record-history.component';

describe('RecordHistoryComponent', () => {
  let component: RecordHistoryComponent;
  let fixture: ComponentFixture<RecordHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
