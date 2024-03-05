import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerTimelineComponent } from './layer-timeline.component';

describe('LayerTimelineComponent', () => {
  let component: LayerTimelineComponent;
  let fixture: ComponentFixture<LayerTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayerTimelineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
