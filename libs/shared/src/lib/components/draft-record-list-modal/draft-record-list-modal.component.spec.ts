import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftRecordListModalComponent } from './draft-record-list-modal.component';

describe('DraftRecordListModalComponent', () => {
  let component: DraftRecordListModalComponent;
  let fixture: ComponentFixture<DraftRecordListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DraftRecordListModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftRecordListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
