import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeospatialFieldsComponent } from './geospatial-fields.component';

describe('GeospatialFieldsComponent', () => {
  let component: GeospatialFieldsComponent;
  let fixture: ComponentFixture<GeospatialFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeospatialFieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeospatialFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
