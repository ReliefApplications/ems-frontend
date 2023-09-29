import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceAvailableFieldsComponent } from './resource-available-fields.component';

describe('ResourceAvailableFieldsComponent', () => {
  let component: ResourceAvailableFieldsComponent;
  let fixture: ComponentFixture<ResourceAvailableFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceAvailableFieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceAvailableFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
