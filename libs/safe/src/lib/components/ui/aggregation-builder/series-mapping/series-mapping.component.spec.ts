import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

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
    component.formGroup = new FormGroup({});
    component.fields$ = new Observable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
