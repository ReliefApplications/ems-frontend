import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapRendererComponent } from './heatmap-renderer.component';

describe('HeatmapRendererComponent', () => {
  let component: HeatmapRendererComponent;
  let fixture: ComponentFixture<HeatmapRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatmapRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeatmapRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
