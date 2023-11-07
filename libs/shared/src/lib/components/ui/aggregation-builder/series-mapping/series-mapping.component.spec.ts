import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { SeriesMappingComponent } from './series-mapping.component';

describe('SeriesMappingComponent', () => {
  let component: SeriesMappingComponent;
  let fixture: ComponentFixture<SeriesMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeriesMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesMappingComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.fields$ = new Observable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
