import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapSettingsComponent } from './heatmap-settings.component';

describe('HeatmapSettingsComponent', () => {
  let component: HeatmapSettingsComponent;
  let fixture: ComponentFixture<HeatmapSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeatmapSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeatmapSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
