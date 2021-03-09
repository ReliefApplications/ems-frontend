import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoTabChartFilterComponent } from './tab-chart-filter.component';

describe('WhoTabChartFilterComponent', () => {
  let component: WhoTabChartFilterComponent;
  let fixture: ComponentFixture<WhoTabChartFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoTabChartFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoTabChartFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
