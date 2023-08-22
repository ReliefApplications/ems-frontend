import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { SafeTagboxComponent } from './tagbox.component';
import { AutocompleteModule } from '@oort-front/ui';

describe('SafeTagboxComponent', () => {
  let component: SafeTagboxComponent;
  let fixture: ComponentFixture<SafeTagboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTagboxComponent],
      imports: [AutocompleteModule],
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
