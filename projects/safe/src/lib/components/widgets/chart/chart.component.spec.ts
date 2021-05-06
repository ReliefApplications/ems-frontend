import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeChartComponent } from './chart.component';

describe('SafeChartComponent', () => {
  let component: SafeChartComponent;
  let fixture: ComponentFixture<SafeChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
