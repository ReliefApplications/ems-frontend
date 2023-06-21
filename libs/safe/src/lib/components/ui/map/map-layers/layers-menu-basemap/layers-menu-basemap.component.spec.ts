import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersMenuBasemapComponent } from './layers-menu-basemap.component';

describe('LayersMenuBasemapComponent', () => {
  let component: LayersMenuBasemapComponent;
  let fixture: ComponentFixture<LayersMenuBasemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayersMenuBasemapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayersMenuBasemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
