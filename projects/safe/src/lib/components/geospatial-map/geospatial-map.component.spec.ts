import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeGeospatialMapComponent } from './geospatial-map.component';

describe('SafeGeospatialMapComponent', () => {
  let component: SafeGeospatialMapComponent;
  let fixture: ComponentFixture<SafeGeospatialMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeGeospatialMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGeospatialMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
