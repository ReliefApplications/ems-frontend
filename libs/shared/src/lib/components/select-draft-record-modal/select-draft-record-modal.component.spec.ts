import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDraftRecordModalComponent } from './select-draft-record-modal.component';

describe('SelectDraftRecordModalComponent', () => {
  let component: SelectDraftRecordModalComponent;
  let fixture: ComponentFixture<SelectDraftRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectDraftRecordModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDraftRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
