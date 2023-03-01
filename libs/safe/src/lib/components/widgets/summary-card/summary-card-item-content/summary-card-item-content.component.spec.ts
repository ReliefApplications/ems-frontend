import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCardItemContentComponent } from './summary-card-item-content.component';

describe('SummaryCardItemContentComponent', () => {
  let component: SummaryCardItemContentComponent;
  let fixture: ComponentFixture<SummaryCardItemContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryCardItemContentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryCardItemContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
