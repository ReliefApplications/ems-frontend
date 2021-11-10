import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeApplicationSummaryComponent } from './application-summary.component';

describe('SafeApplicationSummaryComponent', () => {
  let component: SafeApplicationSummaryComponent;
  let fixture: ComponentFixture<SafeApplicationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeApplicationSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
