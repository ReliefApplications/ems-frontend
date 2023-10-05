import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCardGeneralComponent } from './summary-card-general.component';

describe('SummaryCardGeneralComponent', () => {
  let component: SummaryCardGeneralComponent;
  let fixture: ComponentFixture<SummaryCardGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCardGeneralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryCardGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
