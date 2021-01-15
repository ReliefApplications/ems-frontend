import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoRecordHistoryComponent } from './record-history.component';

describe('WhoRecordHistoryComponent', () => {
  let component: WhoRecordHistoryComponent;
  let fixture: ComponentFixture<WhoRecordHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoRecordHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoRecordHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
