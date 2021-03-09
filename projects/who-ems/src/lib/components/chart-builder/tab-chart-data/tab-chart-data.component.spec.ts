import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoTabChartDataComponent } from './tab-chart-data.component';

describe('WhoTabChartDataComponent', () => {
  let component: WhoTabChartDataComponent;
  let fixture: ComponentFixture<WhoTabChartDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoTabChartDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoTabChartDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
