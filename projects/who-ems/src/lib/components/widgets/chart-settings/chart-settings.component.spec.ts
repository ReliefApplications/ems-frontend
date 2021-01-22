import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WhoChartSettingsComponent } from './chart-settings.component';

describe('WhoChartSettingsComponent', () => {
  let component: WhoChartSettingsComponent;
  let fixture: ComponentFixture<WhoChartSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoChartSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoChartSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
