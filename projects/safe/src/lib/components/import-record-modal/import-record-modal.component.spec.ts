import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeImportRecordModalComponent } from './import-record-modal.component';

describe('SafeImportRecordModalComponent', () => {
  let component: SafeImportRecordModalComponent;
  let fixture: ComponentFixture<SafeImportRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeImportRecordModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeImportRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
