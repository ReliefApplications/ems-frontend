import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoChartBuilderComponent } from './chart-builder.component';

describe('WhoChartBuilderComponent', () => {
  let component: WhoChartBuilderComponent;
  let fixture: ComponentFixture<WhoChartBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoChartBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoChartBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
