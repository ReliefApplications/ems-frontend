import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { TagboxComponent } from './tagbox.component';
import { AutocompleteModule } from '@oort-front/ui';

describe('TagboxComponent', () => {
  let component: TagboxComponent;
  let fixture: ComponentFixture<TagboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagboxComponent],
      imports: [AutocompleteModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagboxComponent);
    component = fixture.componentInstance;
    component.choices$ = new Observable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
