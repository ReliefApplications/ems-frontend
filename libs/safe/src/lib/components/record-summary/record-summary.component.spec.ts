import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeRecordSummaryComponent } from './record-summary.component';

describe('SafeRecordSummaryComponent', () => {
  let component: SafeRecordSummaryComponent;
  let fixture: ComponentFixture<SafeRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeRecordSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRecordSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
