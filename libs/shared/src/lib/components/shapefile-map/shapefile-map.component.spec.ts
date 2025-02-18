import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapefileMapComponent } from './shapefile-map.component';

describe('ShapefileMapComponent', () => {
  let component: ShapefileMapComponent;
  let fixture: ComponentFixture<ShapefileMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShapefileMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShapefileMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
