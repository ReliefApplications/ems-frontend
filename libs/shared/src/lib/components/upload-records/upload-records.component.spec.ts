import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRecordsComponent } from './upload-records.component';

describe('UploadRecordsComponent', () => {
  let component: UploadRecordsComponent;
  let fixture: ComponentFixture<UploadRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadRecordsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
