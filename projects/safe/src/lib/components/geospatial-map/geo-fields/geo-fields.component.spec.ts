import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeGeoFieldsComponent } from './geo-fields.component';

describe('SafeGeoFieldsComponent', () => {
  let component: SafeGeoFieldsComponent;
  let fixture: ComponentFixture<SafeGeoFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeGeoFieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeGeoFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
