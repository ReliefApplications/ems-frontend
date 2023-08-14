import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGeofieldComponent } from './edit-geofield.component';

describe('EditGeofieldComponent', () => {
  let component: EditGeofieldComponent;
  let fixture: ComponentFixture<EditGeofieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditGeofieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditGeofieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
