import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { SafeSeriesMappingComponent } from './series-mapping.component';

describe('SafeSeriesMappingComponent', () => {
  let component: SafeSeriesMappingComponent;
  let fixture: ComponentFixture<SafeSeriesMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSeriesMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSeriesMappingComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
