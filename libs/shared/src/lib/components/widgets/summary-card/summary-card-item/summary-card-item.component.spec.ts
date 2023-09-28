import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCardItemComponent } from './summary-card-item.component';

describe('SummaryCardItemComponent', () => {
  let component: SummaryCardItemComponent;
  let fixture: ComponentFixture<SummaryCardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryCardItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
