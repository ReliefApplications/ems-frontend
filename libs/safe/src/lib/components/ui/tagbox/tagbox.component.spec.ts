import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { Observable } from 'rxjs';

import { SafeTagboxComponent } from './tagbox.component';

describe('SafeTagboxComponent', () => {
  let component: SafeTagboxComponent;
  let fixture: ComponentFixture<SafeTagboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTagboxComponent],
      imports: [MatAutocompleteModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTagboxComponent);
    component = fixture.componentInstance;
    component.choices$ = new Observable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
