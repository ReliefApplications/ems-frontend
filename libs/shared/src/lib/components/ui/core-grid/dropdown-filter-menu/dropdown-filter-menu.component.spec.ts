import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { DropdownFilterMenuComponent } from './dropdown-filter-menu.component';

describe('DropdownFilterMenuComponent', () => {
  let component: DropdownFilterMenuComponent;
  let fixture: ComponentFixture<sharedDropdownFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [UntypedFormBuilder],
      declarations: [DropdownFilterMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownFilterMenuComponent);
    component = fixture.componentInstance;
    component.filter = {
      logic: [],
      filters: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
