import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftRecordModalComponent } from './draft-record-modal.component';

describe('DraftRecordModalComponent', () => {
  let component: DraftRecordModalComponent;
  let fixture: ComponentFixture<DraftRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DraftRecordModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
