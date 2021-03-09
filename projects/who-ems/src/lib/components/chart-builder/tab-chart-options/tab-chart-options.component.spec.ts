import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoTabChartOptionsComponent } from './tab-chart-options.component';

describe('WhoTabChartOptionsComponent', () => {
  let component: WhoTabChartOptionsComponent;
  let fixture: ComponentFixture<WhoTabChartOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoTabChartOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoTabChartOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
