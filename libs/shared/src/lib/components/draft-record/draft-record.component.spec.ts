import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftRecordComponent } from './draft-record.component';

describe('DraftRecordComponent', () => {
  let component: DraftRecordComponent;
  let fixture: ComponentFixture<DraftRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DraftRecordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
