import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationsTabComponent } from './aggregations-tab.component';

describe('AggregationsTabComponent', () => {
  let component: AggregationsTabComponent;
  let fixture: ComponentFixture<AggregationsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggregationsTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
