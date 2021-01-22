import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoChartComponent } from './chart.component';

describe('WhoChartComponent', () => {
  let component: WhoChartComponent;
  let fixture: ComponentFixture<WhoChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
