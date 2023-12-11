import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceCustomFiltersComponent } from './resource-custom-filters.component';

describe('ResourceCustomFiltersComponent', () => {
  let component: ResourceCustomFiltersComponent;
  let fixture: ComponentFixture<ResourceCustomFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceCustomFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceCustomFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
